/* global __DEV__ */

import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import clientMiddleware from './middleware/clientMiddleware'
import persistState from 'redux-localstorage'
import rootReducer from './rootReducer'
import * as sagaWatchers from './sagaWatchers'
import _ from 'lodash'

// Grab the state from a global injected into server-generated HTML
const initialState = window.__INITIAL_STATE__

const enhancers = []

if (__DEV__ && typeof window.devToolsExtension === 'function') {
  enhancers.push(window.devToolsExtension())
}

const persistStateOptions = {
  slicer: (paths = []) => (state) => {
    let subset = {}
    paths.forEach(path => {
      let slice = _.get(state, path)
      slice && _.set(subset, path, slice)
    })

    return subset
  }
}

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(clientMiddleware, sagaMiddleware, thunkMiddleware),
    persistState(['currentGame.membership'], persistStateOptions),
    ...enhancers
  )
)

_.values(sagaWatchers).forEach(sagaMiddleware.run)

if (__DEV__ && module.hot) {
  module.hot.accept('./rootReducer', () =>
    store.replaceReducer(require('./rootReducer').default)
  )
  // TODO hmr for sagas
}

export default store
