/* @flow */
import GameRepository from '../../repositories/GameRepository'
import PlayerRepository from '../../repositories/PlayerRepository'
import GameHistoryService from '../GameHistoryService'
import { newDeck } from '../../../universal/monopoly/cards'
import * as monopoly from '../../../universal/monopoly/monopoly'
import PropertySet from '../../../universal/monopoly/PropertySet'

export default class GameService {
  gameRepository: GameRepository
  playerRepository: PlayerRepository
  gameHistoryService: GameHistoryService

  constructor () {
    this.gameRepository = new GameRepository()
    this.playerRepository = new PlayerRepository()
    this.gameHistoryService = new GameHistoryService()
  }

  static liveUpdates (io) {
    GameRepository.watchForChanges((change) => {
      io.emit('game-change', change)

      if (change.updated) {
        io.emit(`game-${change.new_val.id}-change`, change.new_val)
      }
    })
  }

  getGames (page: number = 0, limit: number = 10): Promise<Game[]> {
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    return this.gameRepository.getAll(page, limit).then(games => games.map(this._removeAvailableCards))
  }

  getGame (id: string, includeAvailableCards: boolean = true): Promise<Game> {
    return this.gameRepository.find(id).then(game => {
      if (includeAvailableCards) {
        return game
      }

      return this._removeAvailableCards(game)
    })
  }

  getCount (): number {
    return this.gameRepository.getCount()
  }

  addGame (game: Game): Promise<*> {
    game.availableCards = newDeck()
    game.discardedCards = []

    return this.gameRepository.insert(game)
  }

  updateGame (id: string, game: Game): Promise<*> {
    return this.gameRepository.update(id, game)
  }

  deleteGame (id: string): Promise<*> {
    return this.gameRepository.delete(id)
  }

  async addPlayer (gameId: string, username: Username): Promise<Player> {
    const newPlayer: Player = await this.playerRepository.joinGame(gameId, username)

    const [game: Game] = await Promise.all([
      this.gameRepository.find(gameId),
      this.gameHistoryService.record(gameId, `${newPlayer.username} has joined`)
    ])

    if (game.currentTurn) {
      return newPlayer
    }

    await Object.assign(game, { currentTurn: username }).save()

    return newPlayer
  }

  async setWinner (gameId: string, winner: Username): Promise<*> {
    const player = await this.playerRepository.findByGameIdAndUsername(gameId, winner)

    const propertySets = player.placedCards.serializedPropertySets.map(PropertySet.unserialize)

    if (!monopoly.hasEnoughFullSetsToWin(propertySets)) {
      throw new Error(`${winner} does not have enough full sets to win!`)
    }

    player.game.winner = winner

    return player.game.save()
  }

  async getPaymentInfo (
    gameId: string
  ): Promise<{ payers: Username[], amount: number, cardPlayed: ?CardKey, payee: ?Username }> {
    const game = await this.gameRepository.find(gameId)

    let paymentInfo = {
      payers: [],
      payee: null,
      cardPlayed: null,
      amount: 0
    }

    game.players.some(player => {
      if (player.payeeInfo && player.payeeInfo.payers.length) {
        paymentInfo = {
          ...player.payeeInfo,
          payee: player.username
        }

        return true
      }
    })

    return paymentInfo
  }

  _removeAvailableCards (game: Game): Game {
    return { ...game, availableCards: undefined }
  }
}
