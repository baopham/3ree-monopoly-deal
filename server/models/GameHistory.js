import thinky from '../thinky'

const type = thinky.type
const r = thinky.r

const GameHistory = thinky.createModel('game_history', {
  id: type.string(),
  gameId: type.string(),
  message: type.string(),
  notifyUser: type.string(),
  createdAt: type.date().default(r.now())
})

module.exports = GameHistory

GameHistory.ensureIndex('gameId')
const Game = require('./Game')
GameHistory.belongsTo(Game, 'game', 'gameId', 'id')
