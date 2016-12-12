/* @flow */
import PlayerRepository from '../repositories/PlayerRepository'
import GameService from './GameService'
import Promise from 'bluebird'
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
        return this.playerRepository.update(player.id, player)
      })
  }

  playCard (gameId: string, username: Username, card: CardKey): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        player.game.discardedCards.push(card)
        player.actionCounter = player.actionCounter + 1

        return Promise.all([
          this.gameService.updateGame(gameId, player.game),
          this.playerRepository.update(player.id, player)
        ])
      })
  }

  discardCard (gameId: string, username: Username, card: CardKey): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, username)
      .then((player: Player) => {
        player.game.discardedCards.push(card)
        return this.gameService.updateGame(gameId, player.game)
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
          this.gameService.updateGame(gameId, game),
          this.playerRepository.update(currentPlayer.id, currentPlayer)
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

        return Promise.join(
          this.gameService.updateGame(gameId, game),
          [first, second],
          (_, drawnCards) => drawnCards
        )
      })
  }

  giveCardToOtherPlayer (
    gameId: string,
    otherPlayerUsername: Username,
    card: CardKey,
    asMoney: boolean = false
  ): Promise<*> {
    const isMoneyCard = asMoney || monopoly.isMoneyCard(card)

    const otherPlayer = this.playerRepository.findByGameIdAndUsername(gameId, otherPlayerUsername)

    const area = isMoneyCard ? 'bank' : 'properties'

    otherPlayer.placedCards[area].push(card)

    return this.playerRepository.update(otherPlayer.id, otherPlayer)
  }

  flipCard (gameId: string, username: Username, cardToFlip: CardKey): Promise<CardKey> {
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

        return this.playerRepository.update(player.id, player)
      })
      .then(() => flippedCard)
  }
}

