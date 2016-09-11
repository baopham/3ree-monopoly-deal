import r from 'rethinkdb'
import { connect } from './rethinkdb-util'
import RealtimeService from './RealtimeService'

const GAMES_TABLE = 'games'
const GAME_MEMBERS_TABLE = 'game_members'

export default class GameService extends RealtimeService {
  static liveUpdates (io) {
    super.liveUpdates(io, GAMES_TABLE, `${GAMES_TABLE}-change`)
  }

  validateAndSanitize (game) {
    // TODO
    return true
  }

  getGames (page = 0, limit = 10) {
    console.log(`Getting games page: ${page}, limit: ${limit}`)
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    return connect()
      .then(conn => {
        return r
          .table(GAMES_TABLE)
          .orderBy(r.desc('created'))
          .skip(page * limit)
          .limit(limit)
          .run(conn)
          .then(cursor => cursor.toArray())
      })
  }

  getGame (id) {
    return connect()
      .then(conn => {
        return r
          .table(GAMES_TABLE)
          .get(id)
          .merge(g => {
            return {
              members: r
                .table(GAME_MEMBERS_TABLE)
                .getAll(id, { index: 'game_id' })
                .coerceTo('array')
            }
          })
          .run(conn)
          .then(response => response)
      })
  }

  getCount () {
    return connect()
      .then(conn => {
        return r
          .table(GAMES_TABLE)
          .count()
          .run(conn)
          .then(result => result)
      })
  }

  addGame (game) {
    this.validateAndSanitize(game)

    game.cards = ['todo']

    return connect()
      .then(conn => {
        game.created = new Date()
        return r
          .table(GAMES_TABLE)
          .insert(game)
          .run(conn)
          .then(response => {
            return Object.assign({}, game, { id: response.generated_keys[0] })
          })
      })
  }

  updateGame (id, game) {
    this.validateAndSanitize(game)

    game.updated = new Date()
    return connect()
      .then(conn => {
        return r
          .table(GAMES_TABLE)
          .get(id)
          .update(game)
          .run(conn)
          .then(() => game)
      })
  }

  deleteGame (id) {
    return connect()
      .then(conn => {
        return r
          .table(GAMES_TABLE)
          .get(id).delete().run(conn)
          .then(() => ({ id: id, deleted: true }))
      })
  }
}
