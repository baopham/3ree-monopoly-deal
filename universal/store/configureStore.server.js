import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerReducer } from 'react-router-redux'
import devTools from 'remote-redux-devtools'

import ducks from '../ducks'

export default (req, initialState) => {
  const rootReducer = combineReducers({
    routing: routerReducer,
    ...ducks
  })

  const enhancers = []

  if (process.env.NODE_ENV !== 'production') {
    enhancers.push(devTools())
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      ...enhancers
    )
  )

  if (process.env.NODE_ENV !== 'production') {
    devTools.updateStore(store)
  }

  return store
}

