import thinky from '../thinky.js'
import cardRequestTypes from '../../universal/monopoly/cardRequestTypes'

const type = thinky.type

const CardRequest = thinky.createModel('game_card_requests', {
  id: type.string(),
  gameId: type.string(),
  info: type.object(),
  type: type.string().enum(Object.keys(cardRequestTypes))
})

module.exports = CardRequest

CardRequest.ensureIndex('gameId')
const Game = require('./Game')
CardRequest.belongsTo(Game, 'game', 'gameId', 'id')

