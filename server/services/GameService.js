/* @flow */
import GameRepository from '../repositories/GameRepository'
import PlayerRepository from '../repositories/PlayerRepository'
import GameHistoryService from './GameHistoryService'
import { newDeck } from '../../universal/monopoly/cards'
import * as monopoly from '../../universal/monopoly/monopoly'

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

    return this.gameRepository.getAll(page, limit)
  }

  getGame (id: string): Promise<Game> {
    return this.gameRepository.find(id)
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

  addPlayer (gameId: string, username: Username): Promise<Player> {
    const joinPromise = this.playerRepository.joinGame(gameId, username)
    const promiseContext = {}

    return joinPromise
      .then(newPlayer => {
        promiseContext.newPlayer = newPlayer

        return Promise.all([
          this.gameRepository.find(gameId),
          this.gameHistoryService.record(gameId, `${newPlayer.username} has joined`)
        ])
      })
      .then(([game, _]) => {
        if (game.currentTurn) {
          return
        }

        game.currentTurn = username

        return game.save()
      })
      .then(() => promiseContext.newPlayer)
  }

  setWinner (gameId: string, winner: Username): Promise<*> {
    return this.playerRepository
      .findByGameIdAndUsername(gameId, winner)
      .then((player: Player) => {
        const propertySets = player.placedCards.serializedPropertySets.map(monopoly.unserializePropertySet)

        if (!monopoly.hasEnoughFullSetsToWin(propertySets)) {
          return Promise.reject(`${winner} does not have enough full sets to win!`)
        }

        player.game.winner = winner

        return player.game.save()
      })
  }
}
