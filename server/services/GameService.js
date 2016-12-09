import GameRepository from '../repositories/GameRepository'
import PlayerRepository from '../repositories/PlayerRepository'
import { newDeck } from '../../universal/monopoly/cards'
import Promise from 'bluebird'

export default class GameService {
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

  getGames (page = 0, limit = 10) {
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    return this.gameRepository.getAll(page, limit)
  }

  getGame (id) {
    return this.gameRepository.find(id)
  }

  getCount () {
    return this.gameRepository.getCount()
  }

  addGame (game) {
    game.availableCards = newDeck()
    game.discardedCards = []

    return this.gameRepository.insert(game)
  }

  updateGame (id, game) {
    game.updatedAt = new Date()

    return this.gameRepository.update(id, game)
  }

  deleteGame (id) {
    return this.gameRepository.delete(id)
  }

  addPlayer (gameId, username) {
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
        return this.gameRepository.update(gameId, game)
      })
      .then(() => {
        return promiseContext.newPlayer
      })
  }

  drawCards (id) {
    return this.gameRepository.find(id)
      .then(game => {
        if (game.availableCards.length < 2) {
          game.availableCards = newDeck()
        }

        const [first, second, ...rest] = game.availableCards
        game.availableCards = rest

        return Promise.join(
          this.updateGame(id, game),
          [first, second],
          (_, drawnCards) => drawnCards
        )
      })
  }
}
