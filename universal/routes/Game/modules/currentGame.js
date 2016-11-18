import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'

function ns (value) {
  return namespace('GAME', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const UPDATE_GAME = ns('UPDATE_GAME')
const UPDATE_MEMBER = ns('UPDATE_MEMBER')
const LOAD_REQUEST = ns('LOAD_REQUEST')
const LOAD_SUCCESS = ns('LOAD_SUCCESS')
const JOIN_REQUEST = ns('JOIN_REQUEST')
const JOIN_SUCCESS = ns('JOIN_SUCCESS')
const JOIN_ERROR = ns('JOIN_ERROR')
const LEAVE_REQUEST = ns('LEAVE_REQUEST')
const LEAVE_SUCCESS = ns('LEAVE_SUCCESS')
const END_TURN_REQUEST = ns('END_TURN_REQUEST')
const END_TURN_SUCCESS = ns('END_TURN_SUCCESS')
const ERROR = ns('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
function getGame (id) {
  return {
    types: [LOAD_REQUEST, LOAD_SUCCESS, ERROR],
    id,
    promise: () => request.get(`${gamesUrl}/${id}`)
  }
}

function join (username) {
  return {
    types: [JOIN_REQUEST, JOIN_SUCCESS, JOIN_ERROR],
    username,
    promise: (dispatch, getState) => {
      const id = getState().currentGame.game.id
      return request.post(`${gamesUrl}/${id}/join`, { username })
    }
  }
}

function leave (username) {
  return {
    types: [LEAVE_REQUEST, LEAVE_SUCCESS, ERROR],
    username,
    promise: (dispatch, getState) => {
      const id = getState().currentGame.game.id
      return request.post(`${gamesUrl}/${id}/leave`, { username })
    }
  }
}

function endTurn () {
  return {
    types: [END_TURN_REQUEST, END_TURN_SUCCESS, ERROR],
    promise: (dispatch, getState) => {
      const id = getState().currentGame.game.id
      return request.put(`${gamesUrl}/${id}/end-turn`)
    }
  }
}

const error = (err) => ({ type: ERROR, error: err })

function subscribeSocket (socket, gameId) {
  return (dispatch, getState) => {
    socket.on(`game-${gameId}-member-change`, onGameMemberChange.bind(this, dispatch))
    socket.on(`game-${gameId}-change`, onGameChange.bind(this, dispatch))
  }
}

function onGameMemberChange (dispatch, change) {
  if (change.created) {
    dispatch({ type: JOIN_SUCCESS, payload: { newMember: change.new_val } })
  } else if (change.deleted) {
    dispatch({ type: LEAVE_SUCCESS, payload: { member: change.old_val } })
  } else {
    dispatch({ type: UPDATE_MEMBER, payload: { member: change.new_val } })
  }
}

function onGameChange (dispatch, game) {
  dispatch({ type: UPDATE_GAME, payload: { game } })
}

function unsubscribeSocket (socket) {
  return (dispatch, getState) => {
    socket.off(`game-${getState().currentGame.game.id}-member-change`)
  }
}

export const actions = {
  getGame,
  join,
  endTurn,
  subscribeSocket,
  unsubscribeSocket
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  game: null,
  membership: {},
  username: null,
  isWorking: false,
  error: null
}

const requestActionHandler = (state) => deepmerge(state, { isWorking: true, error: null })

export default function reducer (state = initialState, action) {
  let nextState

  switch (action.type) {
    case LOAD_REQUEST:
    case END_TURN_REQUEST:
      return requestActionHandler(state)

    case JOIN_REQUEST:
      nextState = requestActionHandler(state)
      nextState.username = action.username
      return nextState

    case JOIN_ERROR:
      return deepmerge(state, {
        username: null,
        error: action.error,
        isWorking: false
      })

    case LOAD_SUCCESS:
      return deepmerge(state, {
        game: action.payload.game,
        isWorking: false,
        error: null
      })

    case JOIN_SUCCESS:
      const newMember = action.payload.newMember

      nextState = deepmerge(state, { isWorking: false, error: null })

      const alreadyJoined = nextState.game.members.filter(member => member.id === newMember.id).length

      if (!alreadyJoined && newMember) {
        nextState.game.members.push(newMember)
      }

      // This is current user.
      if (newMember.username === state.username) {
        nextState.membership[nextState.game.id] = newMember
      }

      if (!nextState.game.currentTurn) {
        nextState.game.currentTurn = newMember.username
      }

      return nextState

    case END_TURN_SUCCESS:
      nextState = deepmerge(state)
      nextState.game.currentTurn = action.payload.nextTurn
      return nextState

    case UPDATE_GAME:
      return deepmerge(state, {
        game: action.payload.game
      })

    case UPDATE_MEMBER:
      nextState = deepmerge(state)
      nextState.game.members.forEach(member => {
        if (member.id === action.payload.member.id) {
          Object.assign(member, action.payload.member)
        }
      })
      return nextState

    case ERROR:
      return deepmerge(state, {
        error: action.error,
        isWorking: false
      })

    default:
      return state
  }
}

