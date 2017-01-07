import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import clientMiddleware from './middleware/clientMiddleware'
import devTools from 'remote-redux-devtools'
import rootReducer from './rootReducer'
import * as sagaWatchers from './sagaWatchers'
import _ from 'lodash'

export default (req, initialState) => {
  const enhancers = []

  if (process.env.NODE_ENV !== 'production') {
    enhancers.push(devTools())
  }

  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(clientMiddleware, sagaMiddleware, thunkMiddleware),
      ...enhancers
    )
  )

  if (process.env.NODE_ENV !== 'production') {
    devTools.updateStore(store)
  }

  _.values(sagaWatchers).forEach(sagaMiddleware.run)

  return store
}

