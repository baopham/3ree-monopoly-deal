import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import clientMiddleware from './middleware/clientMiddleware'
import { routerReducer } from 'react-router-redux'
import devTools from 'remote-redux-devtools'

// TODO: inject reducer
import games from '../routes/Games/modules/games'
import currentGame from '../routes/Game/modules/currentGame'

export default (req, initialState) => {
  const rootReducer = combineReducers({
    routing: routerReducer,
    games,
    currentGame
  })

  const enhancers = []

  if (process.env.NODE_ENV !== 'production') {
    enhancers.push(devTools())
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(clientMiddleware, thunkMiddleware),
      ...enhancers
    )
  )

  if (process.env.NODE_ENV !== 'production') {
    devTools.updateStore(store)
  }

  return store
}

