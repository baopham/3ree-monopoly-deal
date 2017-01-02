import thinky from '../thinky'

const type = thinky.type

const SayNo = thinky.createModel('game_say_no', {
  id: type.string(),
  gameId: type.string(),
  fromUser: type.string(),
  toUser: type.string(),
  cause: type.string(),
  causeInfo: type.object()
})

module.exports = SayNo

SayNo.ensureIndex('gameId')
const Game = require('./Game')
SayNo.belongsTo(Game, 'game', 'gameId', 'id')
