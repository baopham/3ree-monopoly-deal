import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import clientMiddleware from './middleware/clientMiddleware'
import devTools from 'remote-redux-devtools'
import rootReducer from './rootReducer'

export default (req, initialState) => {
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

