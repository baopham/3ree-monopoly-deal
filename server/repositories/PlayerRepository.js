import Player from '../models/Player'
import thinky from '../thinky'

const r = thinky.r

export default class PlayerRepository {
  static table = Player.getTableName()

  static watchForChanges (changeHandler) {
    Player
      .changes()
      .then(feed => {
        feed.each((error, doc) => {
          if (error) {
            console.log(error)
            process.exit(1)
          }

          const change = {
            deleted: doc.isSaved() === false,
            created: doc.getOldValue() === null
          }

          change.updated = !change.deleted && !change.created
          change.old_val = doc.getOldValue()
          change.new_val = doc

          changeHandler(change)
        })
      })
  }

  getAll (page = 0, limit = 10) {
    return Player
      .orderBy(r.desc('createdAt'))
      .skip(page * limit)
      .limit(limit)
      .run()
  }

  find (id) {
    return Player.get(id).run()
  }

  getCount () {
    return Player.count().run()
  }

  insert (payload) {
    const player = new Player(payload)

    return player.save()
  }

  update (id, payload) {
    return Player.get(id).update(payload).execute()
  }

  delete (id) {
    return Player
      .get(id)
      .delete()
      .run()
  }

  joinGame (gameId, username) {
    const placedCards = { bank: [], properties: [] }

    return Player
      .filter({ gameId, username })
      .run()
      .then(result => {
        if (result.length) {
          throw new Error('Player already exists')
        }
        return this.insert({ gameId, username, placedCards })
      })
  }

  leaveGame (gameId, username) {
  }

  findByGameIdAndUsername (gameId, username) {
    return Player
      .filter({ gameId, username })
      .getJoin({ game: true })
      .run()
      .then(result => {
        if (!result.length) {
          throw new Error(`No player ${username} found for game: ${gameId}`)
        }
        const [player] = result
        return player
      })
  }
}
