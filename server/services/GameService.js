/* @flow */
import GameRepository from '../repositories/GameRepository'
import PlayerRepository from '../repositories/PlayerRepository'
import { newDeck } from '../../universal/monopoly/cards'

export default class GameService {
  gameRepository: GameRepository
  playerRepository: PlayerRepository

  constructor () {
    this.gameRepository = new GameRepository()
    this.playerRepository = new PlayerRepository()
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
        return this.gameRepository.find(gameId)
      })
      .then(game => {
        if (game.currentTurn) {
          return
        }

        game.currentTurn = username
        return game.save()
      })
      .then(() => promiseContext.newPlayer)
  }
}
