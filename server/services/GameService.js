import GameRepository from '../repositories/GameRepository'
import MemberRepository from '../repositories/MemberRepository'
import { newDeck } from '../../universal/monopoly/cards'

export default class GameService {
  constructor () {
    this.gameRepository = new GameRepository()
    this.memberRepository = new MemberRepository()
  }

  static liveUpdates (io) {
    GameRepository.watchForChanges((change) => {
      io.emit('game-change', change)

      if (change.updated) {
        io.emit(`game-${change.new_val.id}-change`, change.new_value)
      }
    })
  }

  validateAndSanitize (game) {
    // TODO
    return true
  }

  getGames (page = 0, limit = 10) {
    console.log(`Getting games page: ${page}, limit: ${limit}`)
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
    this.validateAndSanitize(game)

    game.availableCards = newDeck()
    game.discardedCards = []

    return this.gameRepository.insert(game)
  }

  updateGame (id, game) {
    this.validateAndSanitize(game)

    game.updatedAt = new Date()

    return this.gameRepository.update(id, game)
  }

  deleteGame (id) {
    return this.gameRepository.delete(id)
  }

  addMember (id, username) {
    return this.memberRepository.joinGame(id, username)
  }

  endTurn (id) {
    return this.gameRepository.find(id)
      .then(game => {
        const members = game.members
        const currentTurnIndex = members.findIndex(member => member.username === game.currentTurn)
        const nextTurnIndex = currentTurnIndex + 1 === members.length ? 0 : currentTurnIndex + 1
        const nextTurn = game.members[nextTurnIndex].username

        return nextTurn
      })
  }
}
