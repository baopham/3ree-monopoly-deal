import Game from '../models/Game'
import thinky from '../thinky'

const r = thinky.r

export default class GameRepository {
  static table = Game.getTableName()

  static watchForChanges (changeHandler) {
    Game
      .changes()
      .then(feed => {
        feed.each((error, doc) => {
          if (error) {
            console.log(error)
            process.exit(1)
          }

          const change = {
            deleted: doc.isSaved() === false,
            created: doc.getOldValue() === null,
          }

          change.updated = !change.deleted && !change.created
          change.old_val = doc.getOldValue()
          change.new_val = doc

          // TODO: is there a better way to do this?
          Game.count().execute().then((count) => {
            change.count = count
            changeHandler(change)
          })
        })
      })
  }

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
      .update({ ...payload, updatedAt: r.now() })
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
