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

const join = (username) => {
  return (dispatch, getState) => {
    const id = getState().currentGame.game.id

    dispatch(joinRequest(username))

    return request
      .post(`${gamesUrl}/${id}/join`)
      .send({ username })
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
      .send(username)
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
const joinRequest = (username) => ({ type: JOIN_REQUEST, username })
const joinSuccess = (newMember) => ({ type: JOIN_SUCCESS, newMember })
const error = (err) => ({ type: ERROR, error: err })

export const actions = {
  getGame,
  join
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  game: null,
  membership: {},
  isWorking: false,
  error: null
}

const requestActionHandler = (state) => ({ ...state, isWorking: true, error: null })

const actionHandlers = {
  [LOAD_REQUEST]: requestActionHandler,

  [LOAD_SUCCESS]: (state, { game }) => {
    const nextState = deepmerge(state, { game, isWorking: false, error: null })

    return nextState
  },

  [JOIN_REQUEST]: requestActionHandler,

  [JOIN_SUCCESS]: (state, { newMember }) => {
    const nextState = deepmerge(state, { isWorking: false, error: null })

    const alreadyJoined = nextState.game.members.filter(member => member.id === newMember.id).length

    if (!alreadyJoined) {
      nextState.game.members.push(newMember)
    }

    nextState.membership[nextState.game.id] = newMember

    return nextState
  },

  [ERROR]: (state, { err }) => ({ ...state, isWorking: false, error: err })
}

export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
