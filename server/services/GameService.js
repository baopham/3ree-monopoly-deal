import r from 'rethinkdb'
import xss from 'xss'
import { connect } from './rethinkdb-util'
import RealtimeService from './RealtimeService'

const TABLE = 'games'
const EVENT_NAME = 'game-change'

export default class GameService extends RealtimeService {
  static liveUpdates(io) {
    super.liveUpdates(io, TABLE, EVENT_NAME)
  }

  validateAndSanitize(game) {
    // TODO
    return true
  }

  getGames(page = 0, limit = 10) {
    console.log(`Getting games page: ${page}, limit: ${limit}`)
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)

    return connect()
      .then(conn => {
        return r
          .table(TABLE)
          .orderBy(r.desc('created'))
          .skip(page * limit)
          .limit(limit)
          .run(conn)
          .then(cursor => cursor.toArray())
      })
  }

  getCount() {
    return connect()
      .then(conn => {
        return r
          .table(TABLE)
          .count()
          .run(conn)
          .then(result => result)
      })
  }

  addGame(game) {
    this.validateAndSanitize(game)

    return connect()
      .then(conn => {
        game.created = new Date()
        return r
          .table(TABLE)
          .insert(game).run(conn)
          .then(response => {
            return Object.assign({}, game, {id: response.generated_keys[0]})
          })
      })
  }

  updateGame(id, game) {
    this.validateAndSanitize(game)

    game.updated = new Date()
    return connect()
      .then(conn => {
        return r
          .table(TABLE)
          .get(id).update(game).run(conn)
          .then(() => game)
      })
  }

  deleteGame(id) {
    return connect()
      .then(conn => {
        return r
          .table(TABLE)
          .get(id).delete().run(conn)
          .then(() => ({id: id, deleted: true}))
      })
  }
}
