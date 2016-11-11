import { namespace, deepmerge, apiUrl } from './util'
import * as request from '../request-util'

function ns (value) {
  return namespace('GAME', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const LOAD_REQUEST = ns('LOAD_REQUEST')
const LOAD_SUCCESS = ns('LOAD_SUCCESS')
const JOIN_REQUEST = ns('JOIN_REQUEST')
const JOIN_SUCCESS = ns('JOIN_SUCCESS')
const LEAVE_REQUEST = ns('LEAVE_REQUEST')
const LEAVE_SUCCESS = ns('LEAVE_SUCCESS')
const DRAW_CARD_SUCCESS = ns('DRAW_CARD_SUCCESS')
const DISCARD_CARD_SUCCESS = ns('DISCARD_CARD_SUCCESS')
const GIVE_CARD_TO_OTHER_MEMBER_SUCCESS = ns('GIVE_CARD_TO_OTHER_MEMBER_SUCCESS')
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
    types: [JOIN_REQUEST, JOIN_SUCCESS, ERROR],
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

function drawCard (card) {
  // TODO
}

function discardCard (card) {
  // TODO
}

function placeCard (card) {
  // TODO
}

function giveCardToOtherMember (card, username) {
  // TODO
}

const error = (err) => ({ type: ERROR, error: err })

function subscribeSocket (socket, gameId) {
  return (dispatch, getState) => {
    socket.on(`game-${gameId}-member-change`, onGameMemberChange.bind(this, dispatch))
  }
}

function onGameMemberChange (dispatch, change) {
  if (change.created) {
    dispatch({ type: JOIN_SUCCESS, payload: { newMember: change.new_val } })
  } else if (change.deleted) {
    dispatch({ type: LEAVE_SUCCESS, payload: { member: change.old_val } })
  } else {
    dispatch({ type: UPDATE_SUCCESS, payload: { member: change.new_val } })
  }
}

function unsubscribeSocket (socket) {
  return (dispatch, getState) => {
    socket.off(`game-${getState().currentGame.game.id}-member-change`)
  }
}

export const actions = {
  getGame,
  join,
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

const requestActionHandler = (state) => ({ ...state, isWorking: true, error: null })

const actionHandlers = {
  [LOAD_REQUEST]: requestActionHandler,

  [LOAD_SUCCESS]: (state, { payload }) => {
    const nextState = deepmerge(state, { game: payload.game, isWorking: false, error: null })

    return nextState
  },

  [JOIN_REQUEST]: (state, { username }) => ({...state, username, isWorking: true, error: null }),

  [JOIN_SUCCESS]: (state, { payload }) => {
    const newMember = payload.newMember

    const nextState = deepmerge(state, { isWorking: false, error: null })

    const alreadyJoined = nextState.game.members.filter(member => member.id === newMember.id).length

    if (!alreadyJoined) {
      nextState.game.members.push(newMember)
    }

    if (newMember.username === state.username) {
      nextState.membership[nextState.game.id] = newMember
    }

    return nextState
  },

  [ERROR]: (state, { error }) => ({ ...state, isWorking: false, error })
}

export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
