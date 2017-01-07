import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import games from '../routes/Games/modules/games'
import currentGame from '../routes/Game/modules/currentGame'
import currentPlayerCardsOnHand from '../routes/Game/modules/currentPlayerCardsOnHand'
import payment from '../routes/Game/modules/payment'
import gameHistory from '../routes/Game/modules/gameHistory'
import sayNo from '../routes/Game/modules/sayNo'
import cardRequest from '../routes/Game/modules/cardRequest'

const rootReducer = combineReducers({
  routing: routerReducer,
  games,
  currentGame,
  currentPlayerCardsOnHand,
  payment,
  gameHistory,
  sayNo,
  cardRequest
})

export default rootReducer
