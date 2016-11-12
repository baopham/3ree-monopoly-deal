import thinky from '../thinky'
import Member from './Member'

const type = thinky.type
const r = thinky.r

const Game = thinky.createModel('games', {
  id: type.string(),
  name: type.string(),
  winner: type.string(),
  discardedCards: [type.string()],
  availableCards: [type.string()],
  updatedAt: type.date().default(r.now()),
  createdAt: type.date().default(r.now())
})

Game.hasMany(Member, 'members', 'id', 'gameId')

export default Game
