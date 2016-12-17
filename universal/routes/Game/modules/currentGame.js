/* @flow */
import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'
import { actions as paymentActions } from './payment'

function ns (value) {
  return namespace('GAME', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const UPDATE_GAME = ns('UPDATE_GAME')
const UPDATE_PLAYER = ns('UPDATE_PLAYER')
const LOAD_REQUEST = ns('LOAD_REQUEST')
const LOAD_SUCCESS = ns('LOAD_SUCCESS')
const JOIN_REQUEST = ns('JOIN_REQUEST')
const JOIN_SUCCESS = ns('JOIN_SUCCESS')
const JOIN_ERROR = ns('JOIN_ERROR')
const LEAVE_SUCCESS = ns('LEAVE_SUCCESS')
const END_TURN_REQUEST = ns('END_TURN_REQUEST')
const END_TURN_SUCCESS = ns('END_TURN_SUCCESS')
const ERROR = ns('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
function getGame (id: string) {
  return {
    types: [LOAD_REQUEST, LOAD_SUCCESS, ERROR],
    id,
    promise: () => request.get(`${gamesUrl}/${id}`)
  }
}

function join (username: Username) {
  return {
    types: [JOIN_REQUEST, JOIN_SUCCESS, JOIN_ERROR],
    username,
    promise: (dispatch: Function, getState: Function) => {
      const id = getState().currentGame.game.id
      return request.post(`${gamesUrl}/${id}/join`, { username })
    }
  }
}

function endTurn () {
  return {
    types: [END_TURN_REQUEST, END_TURN_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const id = getState().currentGame.game.id
      return request.put(`${gamesUrl}/${id}/end-turn`)
    }
  }
}

function subscribeSocket (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.on(`game-${gameId}-player-change`, onGamePlayerChange.bind(this, dispatch, getState))
    socket.on(`game-${gameId}-change`, onGameChange.bind(this, dispatch))
  }
}

function onGamePlayerChange (dispatch: Function, getState: Function, change: SocketGamePlayerChangeEvent) {
  if (change.created) {
    dispatch({ type: JOIN_SUCCESS, payload: { newPlayer: change.new_val } })
  } else if (change.deleted) {
    dispatch({ type: LEAVE_SUCCESS, payload: { player: change.old_val } })
  } else if (change.updated) {
    dispatch({ type: UPDATE_PLAYER, payload: { player: change.new_val } })
  }

  if (change.payeeInfoUpdated) {
    const player = change.new_val

    dispatch(paymentActions.updatePayment(
      player.username,
      player.payeeInfo.payers,
      player.payeeInfo.amount,
      player.payeeInfo.cardPlayed
    ))
  }
}

function onGameChange (dispatch, game) {
  dispatch({ type: UPDATE_GAME, payload: { game } })
}

function unsubscribeSocket (socket: Socket) {
  return (dispatch: Function, getState: Function) => {
    socket.off(`game-${getState().currentGame.game.id}-player-change`)
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
export type CurrentGameState = {
  game: ?Game,
  membership: {[key: string]: Object},
  username: ?Username,
  error: mixed
}

const initialState: CurrentGameState = {
  game: null,
  membership: {},
  username: null,
  isWorking: false,
  error: null
}

const requestActionHandler = (state: CurrentGameState) => deepmerge(state, { isWorking: true, error: null })

export default function reducer (state: CurrentGameState = initialState, action: ReduxAction) {
  switch (action.type) {
    case LOAD_REQUEST:
    case END_TURN_REQUEST:
      return requestActionHandler(state)

    case JOIN_REQUEST: {
      const nextState = requestActionHandler(state)
      nextState.username = action.username
      return nextState
    }

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

    case JOIN_SUCCESS: {
      const newPlayer = action.payload.newPlayer

      const nextState = deepmerge(state, { isWorking: false, error: null })

      const alreadyJoined = nextState.game.players.filter(player => player.id === newPlayer.id).length

      if (!alreadyJoined && newPlayer) {
        nextState.game.players.push(newPlayer)
      }

      // This is current user.
      if (newPlayer.username === state.username) {
        nextState.membership[nextState.game.id] = newPlayer
      }

      if (!nextState.game.currentTurn) {
        nextState.game.currentTurn = newPlayer.username
      }

      return nextState
    }

    case END_TURN_SUCCESS: {
      const nextState = deepmerge(state)
      nextState.game.currentTurn = action.payload.nextTurn
      return nextState
    }

    case UPDATE_GAME:
      return deepmerge(state, {
        game: action.payload.game
      })

    case UPDATE_PLAYER: {
      const nextState = deepmerge(state)
      nextState.game.players.forEach(player => {
        if (player.id === action.payload.player.id) {
          Object.assign(player, action.payload.player)
        }
      })
      return nextState
    }

    case ERROR:
      return deepmerge(state, {
        error: action.error,
        isWorking: false
      })

    default:
      return state
  }
}
