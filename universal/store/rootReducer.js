import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import games from '../routes/Games/modules/games'
import currentGame from '../routes/Game/modules/currentGame'
import currentPlayerCards from '../routes/Game/modules/currentPlayerCards'
import payment from '../routes/Game/modules/payment'

const rootReducer = combineReducers({
  routing: routerReducer,
  games,
  currentGame,
  currentPlayerCards,
  payment
})

export default rootReducer
