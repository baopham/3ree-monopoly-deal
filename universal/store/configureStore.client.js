/* global __DEV__ */

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import clientMiddleware from './middleware/clientMiddleware'
import { routerReducer } from 'react-router-redux'
import persistState from 'redux-localstorage'

import games from '../routes/Games/modules/games'
import currentGame from '../routes/Game/modules/currentGame'
import player from '../routes/Game/modules/player'

// Grab the state from a global injected into server-generated HTML
const initialState = window.__INITIAL_STATE__

const rootReducer = combineReducers({
  routing: routerReducer,
  games,
  currentGame,
  player
})

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

export default store
