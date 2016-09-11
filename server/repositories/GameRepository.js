import Game from '../models/Game'
import thinky from '../thinky'

const r = thinky.r

export default class GameRepository {
  static table = Game.getTableName()

  getAll (page = 0, limit = 10) {
    return Game
      .orderBy(r.desc('createdAt'))
      .skip(page * limit)
      .limit(limit)
      .run()
  }

  find (id) {
    return Game.get(id).getJoin({ members: true }).run()
  }

  getCount () {
    return Game.count().execute()
  }

  insert (payload) {
    const game = new Game(payload)

    return game.save()
  }

  update (id, payload) {
    return Game
      .get(id)
      .update(payload)
      .run()
  }

  delete (id) {
    return Game
      .get(id)
      .getJoin({ members: true })
      .run()
      .then(game => {
        game.deleteAll({ members: true })
        return game
      })
  }
}
