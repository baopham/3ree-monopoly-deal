/* @flow */
import PlayerRepository from '../repositories/PlayerRepository'
import GameService from './GameService'
import * as monopoly from '../../universal/monopoly/monopoly'
import { newDeck } from '../../universal/monopoly/cards'

export default class PlayerService {
  playerRepository: PlayerRepository
  gameService: GameService

  constructor () {
    this.playerRepository = new PlayerRepository()
    this.gameService = new GameService()
  }

  static liveUpdates (io) {
    PlayerRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-player-change`, change)
    })
  }

  placeCard (gameId: string, username: Username, card: CardKey, asMoney: boolean = false): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        const area = asMoney ? 'bank' : 'properties'
        player.placedCards[area].push(card)
        player.actionCounter = player.actionCounter + 1
        return player.save()
      })
  }

  playCard (gameId: string, username: Username, cardKey: CardKey): Promise<*> {
    const cardRequiresPayment = monopoly.cardRequiresPayment(cardKey)

    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, username)
    ]

    if (cardRequiresPayment) {
      promises.push(this.playerRepository.getAllPlayers(gameId))
    }

    return Promise.all(promises)
      .then(([player: Player, players: Player[]]) => {
        player.game.lastCardPlayedBy = username
        player.game.discardedCards.push(cardKey)
        player.actionCounter = player.actionCounter + 1

        if (cardRequiresPayment) {
          player.payeeInfo = {
            cardPlayed: cardKey,
            amount: monopoly.getCardPaymentAmount(cardKey, player.placedCards.properties),
            payers: players
              .filter(p => p.username !== username)
              .map(p => p.username)
          }
        }

        return player.saveAll()
      })
  }

  discardCard (gameId: string, username: Username, card: CardKey): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        player.game.discardedCards.push(card)
        player.game.lastCardPlayedBy = username
        return player.game.save()
      })
  }

  endTurn (gameId: string): Promise<Username> {
    return this.gameService.getGame(gameId)
      .then((game: Game) => {
        const players = game.players
        const currentTurnIndex = players.findIndex(player => player.username === game.currentTurn)
        const currentPlayer = players[currentTurnIndex]
        const nextTurnIndex = currentTurnIndex + 1 === players.length ? 0 : currentTurnIndex + 1
        const nextTurn = game.players[nextTurnIndex].username

        game.currentTurn = nextTurn
        currentPlayer.actionCounter = 0

        return Promise.all([
          game.save(),
          currentPlayer.save()
        ])
      })
      .then(([game, player]) => game.currentTurn)
  }

  drawCards (gameId: string): Promise<CardKey[]> {
    return this.gameService.getGame(gameId)
      .then((game: Game) => {
        if (game.availableCards.length < 2) {
          game.availableCards = newDeck()
        }

        const [first, second, ...rest] = game.availableCards
        game.availableCards = rest

        return Promise.all([
          game.save(),
          [first, second]
        ])
      })
      .then(([_, drawnCards]) => drawnCards)
  }

  flipCard (gameId: string, username: Username, cardToFlip: CardKey): Promise<CardKey> | Promise<*> {
    const card: Card = monopoly.getCardObject(cardToFlip)

    if (!monopoly.canFlipCard(card)) {
      return Promise.reject(new Error(`Card ${cardToFlip} is not flippable`))
    }

    const flippedCard: CardKey = monopoly.flipCard(cardToFlip)

    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        const cardToFlipIndex = player.placedCards.properties.findIndex(c => c === cardToFlip)
        player.placedCards.properties[cardToFlipIndex] = flippedCard

        return player.save()
      })
      .then(() => flippedCard)
  }

  pay (gameId: string, payer: Username, payee: Username, cardsForPayment: CardKey[]): Promise<*> {
    const moneyCards = monopoly.getMoneyCards(cardsForPayment)
    const propertyCards = monopoly.getPropertyCards(cardsForPayment)
    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, payer)
    ]

    return Promise.all(promises)
      .then(([payeePlayer: Player, payerPlayer: Player]) => {
        return Promise.all([
          updatePayer(payerPlayer),
          updatePayee(payeePlayer)
        ])
      })

    function updatePayee (payeePlayer: Player): Promise<*> {
      const { payeeInfo } = payeePlayer

      if (!payeeInfo.payers || !payeeInfo.payers.includes(payer)) {
        return Promise.reject()
      }

      payeePlayer.payeeInfo.payers = payeeInfo.payers.filter(p => p !== payer)

      if (!payeePlayer.payeeInfo.payers.length) {
        payeePlayer.payeeInfo.amount = 0
        payeePlayer.payeeInfo.cardPlayed = null
      }

      const { placedCards } = payeePlayer

      placedCards.bank = placedCards.bank.concat(moneyCards)
      placedCards.properties = placedCards.properties.concat(propertyCards)
      return payeePlayer.save()
    }

    function updatePayer (payerPlayer: Player): Promise<*> {
      const { placedCards } = payerPlayer

      moneyCards.forEach(card => {
        const indexToRemove = placedCards.bank.findIndex(c => c === card)
        placedCards.bank.splice(indexToRemove, 1)
      })

      propertyCards.forEach(card => {
        const indexToRemove = placedCards.properties.findIndex(c => c === card)
        placedCards.properties.splice(indexToRemove, 1)
      })

      return payerPlayer.save()
    }
  }
}
