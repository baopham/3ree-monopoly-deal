import { namespace, deepmerge, apiUrl } from './util'
import * as request from '../request-util'

function namespacedConstant (value) {
  return namespace('GAMES', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const LOAD_PAGE_REQUEST = namespacedConstant('LOAD_PAGE_REQUEST')
const LOAD_SUCCESS = namespacedConstant('LOAD_SUCCESS')
const ADD_REQUEST = namespacedConstant('ADD_REQUEST')
const ADD_SUCCESS = namespacedConstant('ADD_SUCCESS')
const DELETE_REQUEST = namespacedConstant('DELETE_REQUEST')
const DELETE_SUCCESS = namespacedConstant('DELETE_SUCCESS')
const UPDATE_REQUEST = namespacedConstant('UPDATE_REQUEST')
const UPDATE_SUCCESS = namespacedConstant('UPDATE_SUCCESS')
const ERROR = namespacedConstant('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
function getGames (page = 0) {
  return {
    types: [LOAD_PAGE_REQUEST, LOAD_SUCCESS, ERROR],
    page,
    promise: () => request.get(gamesUrl, { page })
  }
}

function addGame (game) {
  return {
    types: [ADD_REQUEST, null, ERROR],
    game,
    promise: () => request.post(gamesUrl, game)
  }
}

function subscribeSocket (socket) {
  return (dispatch) => {
    socket.on('game-change', onGameChange.bind(this, dispatch))
  }
}

function onGameChange (dispatch, change) {
  if (change.created) {
    dispatch({ type: ADD_SUCCESS, payload: { game: change.new_val, count: change.count } })
  } else if (change.deleted) {
    dispatch({ type: DELETE_SUCCESS, payload: { game: change.old_val, count: change.count } })
  } else {
    dispatch({ type: UPDATE_SUCCESS, payload: { game: change.new_val, count: change.count } })
  }
}

function unsubscribeSocket (socket) {
  return (dispatch) => {
    socket.off('game-change')
  }
}

export const actions = {
  getGames,
  addGame,
  subscribeSocket,
  unsubscribeSocket
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  games: [],
  isWorking: false,
  error: null,
  limit: 10,
  page: 0,
  count: 0
}

const requestActionHandler = (state) => ({ ...state, isWorking: true, error: null })

const actionHandlers = {
  [LOAD_PAGE_REQUEST]: (state, { page }) => ({ ...state, page }),

  [LOAD_SUCCESS]: (state, { payload }) => ({
    ...state,
    games: payload.games,
    count: payload.count,
    isWorking: false,
    error: null
  }),

  [ADD_REQUEST]: requestActionHandler,

  [DELETE_REQUEST]: requestActionHandler,

  [UPDATE_REQUEST]: requestActionHandler,

  [ADD_SUCCESS]: (state, { payload }) => {
    const nextState = deepmerge(state, {
      isWorking: false,
      error: null,
      games: [payload.game, ...state.games.slice(0, state.limit - 1)],
      count: payload.count
    })
    return nextState
  },

  [DELETE_SUCCESS]: (state, { payload }) => {
    const nextState = deepmerge(state, { isWorking: false, error: null, count })
    nextState.games = state.games.filter(g => g.id !== payload.game.id)

    return nextState
  },

  [ERROR]: (state, { err }) => ({ ...state, isWorking: false, error: err })
}

export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
