import thinky from '../thinky'

const type = thinky.type
const r = thinky.r

const Game = thinky.createModel('games', {
  id: type.string(),
  name: type.string(),
  winner: type.string(),
  discardedCards: [type.string()],
  availableCards: [type.string()],
  currentTurn: type.string(),
  lastCardPlayedBy: type.string(),
  updatedAt: type.date().default(r.now()),
  createdAt: type.date().default(r.now())
})

module.exports = Game

const Player = require('./Player')
Game.hasMany(Player, 'players', 'id', 'gameId')
