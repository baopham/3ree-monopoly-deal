import { namespace, deepmerge, apiUrl } from './util'
import request from 'superagent'

function namespacedConstant (value) {
  return namespace('GAME', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const LOAD_REQUEST = namespacedConstant('LOAD_REQUEST')
const LOAD_SUCCESS = namespacedConstant('LOAD_SUCCESS')
const JOIN_REQUEST = namespacedConstant('JOIN_REQUEST')
const JOIN_SUCCESS = namespacedConstant('JOIN_SUCCESS')
const LEAVE_REQUEST = namespacedConstant('LEAVE_REQUEST')
const LEAVE_SUCCESS = namespacedConstant('LEAVE_SUCCESS')
const ERROR = namespacedConstant('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
const getGame = (id) => {
  return (dispatch) => {
    dispatch(loadRequest(id))

    return request
      .get(`${gamesUrl}/${id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch(error(err))
        } else {
          dispatch(loadSuccess(res.body))
        }
      })
  }
}

const join = (name) => {
  return (dispatch) => {
    dispatch(joinRequest())

    return request
      .post(`${gamesUrl}/${id}/join`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch(error(err))
        } else {
          dispatch(joinSuccess(res.body))
        }
      })
  }
}

const leave = (name) => {
  return (dispatch) => {
    return request
      .post(`${gamesUrl}/${id}/leave`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch(error(err))
        } else {
          dispatch(leaveSuccess(res.body))
        }
      })
  }
}

const loadRequest = (id) => ({ type: LOAD_REQUEST, id })
const loadSuccess = (game) => ({ type: LOAD_SUCCESS, game })
const joinRequest = () => ({ type: JOIN_REQUEST })
const joinSuccess = (name) => ({ type: JOIN_SUCCESS, name })
const error = (err) => ({ type: ERROR, error: err })

export const actions = {
  getGame,
  join
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  game: {},
  isWorking: false,
  error: null
}

const requestActionHandler = (state) => ({ ...state, isWorking: true, error: null })

const actionHandlers = {
  [LOAD_REQUEST]: requestActionHandler,

  [LOAD_SUCCESS]: (state, { game }) => ({ ...state, game, isWorking: false, error: null }),

  [JOIN_REQUEST]: requestActionHandler,

  [JOIN_SUCCESS]: (state, { name }) => {
    const nextState = deepmerge(state, { isWorking: false, error: null })

    if (nextState.game.members.indexOf(name) === -1) {
      nextState.game.members.push(name)
    }

    return nextState
  },

  [ERROR]: (state, { err }) => ({ ...state, isWorking: false, error: err })
}

export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
