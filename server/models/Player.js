import thinky from '../thinky'

const type = thinky.type

const Player = thinky.createModel('game_players', {
  id: type.string(),
  username: type.string(),
  gameId: type.string(),
  actionCounter: type.number().default(0),
  placedCards: type.object(),
  payeeInfo: type.object(),
  leftOverCards: type.array().default([])
})

module.exports = Player

Player.ensureIndex('gameId')
const Game = require('./Game')
Player.belongsTo(Game, 'game', 'gameId', 'id')
