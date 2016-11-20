/* global __DEV__ */

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import clientMiddleware from './middleware/clientMiddleware'
import persistState from 'redux-localstorage'
import rootReducer from './rootReducer'

// Grab the state from a global injected into server-generated HTML
const initialState = window.__INITIAL_STATE__

const enhancers = []

if (__DEV__ && typeof window.devToolsExtension === 'function') {
  enhancers.push(window.devToolsExtension())
}

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(clientMiddleware, thunkMiddleware),
    persistState(['currentGame']),
    ...enhancers
  )
)

if (__DEV__ && module.hot) {
  module.hot.accept('./rootReducer', () =>
    store.replaceReducer(require('./rootReducer').default)
  )
}

export default store
