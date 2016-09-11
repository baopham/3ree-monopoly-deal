import thinky from '../thinky'

const type = thinky.type
const r = thinky.r

const Member = thinky.createModel('game_members', {
  id: type.string(),
  username: type.string(),
  gameId: type.string(),
  cardsOnHand: [type.string()],
  placedCards: type.object(), // { bank: [type.string()], properties: [type.string()] }
})

Member.ensureIndex('gameId')

export default Member

