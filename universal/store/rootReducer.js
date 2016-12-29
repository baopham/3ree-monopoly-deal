import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import games from '../routes/Games/modules/games'
import currentGame from '../routes/Game/modules/currentGame'
import currentPlayerCardsOnHand from '../routes/Game/modules/currentPlayerCardsOnHand'
import payment from '../routes/Game/modules/payment'
import gameHistory from '../routes/Game/modules/gameHistory'

const rootReducer = combineReducers({
  routing: routerReducer,
  games,
  currentGame,
  currentPlayerCardsOnHand,
  payment,
  gameHistory
})

export default rootReducer
