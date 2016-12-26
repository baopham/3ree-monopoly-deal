import GameHistory from '../models/GameHistory'
import thinky from '../thinky'

const r = thinky.r

export default class GameHistoryRepository {
  static table = GameHistory.getTableName()

  static watchForChanges (changeHandler) {
    GameHistory
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
            updated: null,
            old_val: null,
            new_val: null
          }

          change.updated = !change.deleted && !change.created
          change.old_val = doc.getOldValue()
          change.new_val = doc

          changeHandler(change)
        })
      })
  }

  getAll (page = 0, limit = 10) {
    return GameHistory
      .orderBy(r.desc('createdAt'))
      .skip(page * limit)
      .limit(limit)
      .run()
  }

  getCount () {
    return GameHistory.count().execute()
  }

  insert (payload) {
    const gameHistory = new GameHistory(payload)

    return gameHistory.save()
  }
}
