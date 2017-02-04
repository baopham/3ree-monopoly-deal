/* @flow */
import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import request from 'axios'

function ns (value) {
  return namespace('GAMES', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const LOAD_PAGE_REQUEST = ns('LOAD_PAGE_REQUEST')
const LOAD_SUCCESS = ns('LOAD_SUCCESS')
const ADD_REQUEST = ns('ADD_REQUEST')
const ADD_SUCCESS = ns('ADD_SUCCESS')
const DELETE_REQUEST = ns('DELETE_REQUEST')
const DELETE_SUCCESS = ns('DELETE_SUCCESS')
const UPDATE_REQUEST = ns('UPDATE_REQUEST')
const UPDATE_SUCCESS = ns('UPDATE_SUCCESS')
const ERROR = ns('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
function getGames (page: number = 0) {
  return {
    types: [LOAD_PAGE_REQUEST, LOAD_SUCCESS, ERROR],
    page,
    promise: () => request.get(gamesUrl, { params: { page } })
  }
}

function addGame (game: Object) {
  return {
    types: [ADD_REQUEST, null, ERROR],
    game,
    promise: () => request.post(gamesUrl, game)
  }
}

function subscribeSocket () {
  return (dispatch: Function) => {
    global.socket.on('game-change', onGameChange.bind(this, dispatch))
  }
}

function onGameChange (dispatch: Function, change: Function) {
  if (change.created) {
    dispatch({ type: ADD_SUCCESS, payload: { game: change.new_val, count: change.count } })
  } else if (change.deleted) {
    dispatch({ type: DELETE_SUCCESS, payload: { game: change.old_val, count: change.count } })
  } else {
    dispatch({ type: UPDATE_SUCCESS, payload: { game: change.new_val, count: change.count } })
  }
}

function unsubscribeSocket () {
  return (dispatch: Function) => {
    global.socket.off('game-change')
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
export type GamesState = {
  games: Game[],
  isWorking: boolean,
  error: mixed,
  limit: number,
  page: number,
  count: number
}

const initialState: GamesState = {
  games: [],
  isWorking: false,
  error: null,
  limit: 10,
  page: 0,
  count: 0
}

export default function reducer (state: GamesState = initialState, action: ReduxAction) {
  switch (action.type) {
    case ADD_REQUEST:
    case DELETE_REQUEST:
    case UPDATE_REQUEST:
      return deepmerge(state, {
        isWorking: true,
        error: false
      })

    case LOAD_PAGE_REQUEST:
      return deepmerge(state, { page: action.page })

    case LOAD_SUCCESS:
      return {
        ...state,
        games: action.payload.games,
        count: action.payload.count,
        isWorking: false,
        error: null
      }

    case ADD_SUCCESS:
      return {
        ...state,
        isWorking: false,
        error: null,
        games: [action.payload.game, ...state.games.slice(0, state.limit - 1)],
        count: action.payload.count
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        games: state.games.filter(g => g.id !== action.payload.game.id)
      }

    default:
      return state
  }
}
