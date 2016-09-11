/* global __DEV__ */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { routerReducer } from 'react-router-redux'

import ducks from '../ducks'

// Grab the state from a global injected into server-generated HTML
const initialState = window.__INITIAL_STATE__

const rootReducer = combineReducers({
  routing: routerReducer,
  ...ducks
})

const enhancers = []

if (__DEV__ && typeof window.devToolsExtension === 'function') {
  enhancers.push(window.devToolsExtension())
}

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunkMiddleware),
    ...enhancers
  )
)

if (module.hot) {
  module.hot.accept('../ducks', () =>
    store.replaceReducer(combineReducers({
      routing: routerReducer,
      ...require('../ducks')
    }))
  )
}

export default store
