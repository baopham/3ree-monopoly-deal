/* @flow */
import PlayerRepository from '../../repositories/PlayerRepository'
import GameService from '../GameService'
import GameHistoryService from '../GameHistoryService'
import * as monopoly from '../../../universal/monopoly/monopoly'
import {
  PROPERTY_WILDCARD,
  HOUSE,
  HOTEL,
  newDeck
} from '../../../universal/monopoly/cards'
import PropertySet from '../../../universal/monopoly/PropertySet'
import * as paymentHelper from './paymentHelper'
import type { PropertySetId } from '../../../universal/monopoly/PropertySet'

export default class PlayerService {
  playerRepository: PlayerRepository
  gameService: GameService
  gameHistoryService: GameHistoryService

  constructor () {
    this.playerRepository = new PlayerRepository()
    this.gameService = new GameService()
    this.gameHistoryService = new GameHistoryService()
  }

  static liveUpdates (io) {
    PlayerRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-player-change`, change)
    })
  }

  placeCard (
    gameId: string, username: Username, cardKey: CardKey, asMoney: boolean = false, setToPutIn?: SerializedPropertySet
  ): Promise<*> {
    const logAction = () => this.gameHistoryService.record(gameId, `${username} placed ${cardKey}`)

    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then(increaseActionCounter)
      .then(putCardInTheRightPlace)
      .then(logAction)

    //////
    function increaseActionCounter (player: Player): Player {
      player.actionCounter = player.actionCounter + 1
      return player
    }

    function putCardInTheRightPlace (player: Player): Promise<*> {
      if (asMoney) {
        player.placedCards.bank.push(cardKey)
        return player.save()
      }

      if ([HOUSE, HOTEL, PROPERTY_WILDCARD].includes(cardKey)) {
        return putIntoASet(player)
      }

      const card = monopoly.getCardObject(cardKey)

      // Side effect
      const hasBeenPlaced = monopoly.putInTheFirstNonFullSet(cardKey, player.placedCards.serializedPropertySets)

      if (!hasBeenPlaced) {
        const newPropertySet = new PropertySet(monopoly.getCardObject(card.treatAs), [cardKey]).serialize()
        player.placedCards.serializedPropertySets.push(newPropertySet)
      }

      return player.save()
    }

    function putIntoASet (player: Player): Promise<*> {
      if (!setToPutIn) {
        return Promise.reject(`Need to provide what set to put ${cardKey} in`)
      }

      const propertySetToPutIn = PropertySet.unserialize(setToPutIn)

      const playerSerializedSet = player.placedCards.serializedPropertySets
        .find(s => PropertySet.unserialize(s).equals(propertySetToPutIn))

      if (!playerSerializedSet) {
        return Promise.reject('Cannot place card in the set. Player has no such set')
      }

      const playerUnserializedSet = PropertySet.unserialize(playerSerializedSet)

      if (!playerUnserializedSet.addCard(cardKey)) {
        return Promise.reject(`Cannot place ${cardKey}. Invalid property set`)
      }

      // Update in place
      Object.assign(playerSerializedSet, playerUnserializedSet.serialize())

      return player.save()
    }
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
            amount: monopoly.getCardPaymentAmount(cardKey, player.placedCards.serializedPropertySets),
            payers: players.filter(p => p.username !== username).map(p => p.username)
          }
        }

        const playersToNotify = player.payeeInfo ? player.payeeInfo.payers : undefined

        return Promise.all([
          player.saveAll(),
          this.gameHistoryService.record(gameId, `${username} played ${cardKey}`, playersToNotify)
        ])
      })
  }

  discardCard (gameId: string, username: Username, card: CardKey): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        player.game.discardedCards.push(card)
        player.game.lastCardPlayedBy = username
        return Promise.all([
          player.game.save(),
          this.gameHistoryService.record(gameId, `${username} discarded ${card}`)
        ])
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
          game.saveAll(),
          this.gameHistoryService.record(gameId, `${nextTurn}'s turn`, [nextTurn])
        ])
      })
      .then(([game, _]) => game.currentTurn)
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
          [first, second],
          this.gameHistoryService.record(gameId, `${game.currentTurn} picked up 2 cards`),
          game.save()
        ])
      })
      .then(([drawnCards]) => drawnCards)
  }

  removePayer (gameId: string, payer: Username, payee: Username): Promise<*> {
    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, payer)
    ]

    return Promise.all(promises)
      .then(([payeePlayer: Player, payerPlayer: Player]) => {
        return Promise.all([
          paymentHelper.updatePayee(payeePlayer, payer, [], new Map()),
          paymentHelper.updatePayer(payerPlayer, [], new Map())
        ])
      })
  }

  pay (
    gameId: string, payer: Username,
    payee: Username, moneyCards: CardKey[],
    mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
  ): Promise<*> {
    const promises = [
      this.playerRepository.findByGameIdAndUsername(gameId, payee),
      this.playerRepository.findByGameIdAndUsername(gameId, payer)
    ]

    return Promise.all(promises)
      .then(([payeePlayer: Player, payerPlayer: Player]) => {
        const dueAmount = payeePlayer.payeeInfo.amount
        return Promise.all([
          updatePayer(payerPlayer),
          updatePayee(payeePlayer),
          this.gameHistoryService.record(gameId, paymentLogMessage(dueAmount))
        ])
      })

    //////
    function updatePayee (payeePlayer: Player): Promise<*> {
      return paymentHelper.updatePayee(payeePlayer, payer, moneyCards, mapOfNonMoneyCards)
    }

    function updatePayer (payerPlayer: Player): Promise<*> {
      return paymentHelper.updatePayer(payerPlayer, moneyCards, mapOfNonMoneyCards)
    }

    function paymentLogMessage (dueAmount: number): string {
      if (!moneyCards.length && !mapOfNonMoneyCards.size) {
        return `${payer} has no money to pay ${payee} $${dueAmount}M`
      }

      const allNonMoneyCards = Array.from(mapOfNonMoneyCards.values()).reduce((acc, cards) => acc.concat(cards), [])
      const allCards = moneyCards.concat(allNonMoneyCards)

      return `${payer} paid ${payee} $${dueAmount}M with ${allCards.join(', ')}`
    }
  }
}
