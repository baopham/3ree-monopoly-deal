import thinky from '../thinky'

const type = thinky.type
const r = thinky.r

const Member = thinky.createModel('game_members', {
  id: type.string(),
  username: type.string(),
  gameId: type.string(),
  placedCards: type.object() // { bank: [type.string()], properties: [type.string()] }
})

module.exports = Member

Member.ensureIndex('gameId')
const Game = require('./Game')
Member.belongsTo(Game, 'game', 'gameId', 'id')
