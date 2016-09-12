import Member from '../models/Member'
import thinky from '../thinky'

const r = thinky.r

export default class MemberRepository {
  static table = Member.getTableName()

  getAll (page = 0, limit = 10) {
    return Member
      .orderBy(r.desc('createdAt'))
      .skip(page * limit)
      .limit(limit)
      .run()
  }

  find (id) {
    return Member.get(id).getJoin({ cards: true }).run()
  }

  getCount () {
    return Member.count().run()
  }

  insert (payload) {
    const member = new Member(payload)

    return member.save()
  }

  update (id, payload) {
    return Member.get(id).update(payload).execute()
  }

  delete (id) {
    return Member
      .get(id)
      .delete()
      .run()
  }

  joinGame (gameId, username) {
    const placedCards = { bank: [], properties: [] }
    const cardsOnHand = []

    return Member
      .filter({ gameId, username })
      .run()
      .then(result => {
        if (result.length) {
          throw new Error('Member already exists')
        }
        return this.insert({ gameId, username, placedCards, cardsOnHand })
      })
  }

  leaveGame (gameId, username) {
  }
}
