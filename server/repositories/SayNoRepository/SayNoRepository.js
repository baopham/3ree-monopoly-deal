import SayNo from '../../models/SayNo'
import ModelNotFound from '../../errors/ModelNotFound'

export default class SayNoRepository {
  static table = SayNo.getTableName()

  static watchForChanges (changeHandler) {
    SayNo
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
            updated: false,
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

  findByGameId (gameId) {
    return SayNo
      .filter({ gameId })
      .run()
      .then(result => {
        if (!result.length) {
          return Promise.reject(new ModelNotFound(`No SayNo record found for game id ${gameId}`))
        }

        const [sayNo] = result
        return sayNo
      })
  }

  insert (payload) {
    const sayNo = new SayNo(payload)

    return sayNo.save()
  }
}
