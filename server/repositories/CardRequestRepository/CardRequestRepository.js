import CardRequest from '../../models/CardRequest'

export default class CardRequestRepository {
  static table = CardRequest.getTableName()

  static watchForChanges (changeHandler) {
    CardRequest
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

  insert (payload) {
    const cardRequest = new CardRequest(payload)

    return cardRequest.save()
  }

  find (id) {
    return CardRequest.get(id).run()
  }
}
