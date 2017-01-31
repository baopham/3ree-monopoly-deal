/* @flow */
import { namespace, deepmerge, apiUrl, getGameIdAndCurrentPlayerUsername } from '../../../../ducks-utils'
import request from 'axios'
import { actions as paymentActions } from '../payment'
import { actions as gameHistoryActions } from '../gameHistory'
import { actions as currentPlayerCardsOnHandActions } from '../currentPlayerCardsOnHand'
import { actions as sayNoActions } from '../sayNo'
import { actions as cardRequestActions } from '../cardRequest'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

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
const SET_WINNER_REQUEST = ns('SET_WINNER_REQUEST')
const SET_WINNER_SUCCESS = ns('SET_WINNER_SUCCESS')
const FLIP_PLACED_CARD_REQUEST = ns('FLIP_PLACED_CARD_REQUEST')
const FLIP_PLACED_CARD_SUCCESS = ns('FLIP_PLACED_CARD_SUCCESS')
const FLIP_PLACED_LEFT_OVER_CARD_REQUEST = ns('FLIP_PLACED_LEFT_OVER_CARD_REQUEST')
const FLIP_PLACED_LEFT_OVER_CARD_SUCCESS = ns('FLIP_PLACED_LEFT_OVER_CARD_SUCCESS')
const MOVE_PLACED_CARD_REQUEST = ns('MOVE_PLACED_CARD_REQUEST')
const MOVE_PLACED_CARD_SUCCESS = ns('MOVE_PLACED_CARD_SUCCESS')
const MOVE_PLACED_LEFT_OVER_CARD_REQUEST = ns('MOVE_PLACED_LEFT_OVER_CARD_REQUEST')
const MOVE_PLACED_LEFT_OVER_CARD_SUCCESS = ns('MOVE_PLACED_LEFT_OVER_CARD_SUCCESS')
const RESET = ns('RESET')
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

function flipPlacedCard (card: CardKey, propertySetId: PropertySetId) {
  return {
    types: [FLIP_PLACED_CARD_REQUEST, FLIP_PLACED_CARD_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const [id, username] = getGameIdAndCurrentPlayerUsername(getState())
      return request.put(`${gamesUrl}/${id}/flip-card`, { card, username, propertySetId })
    }
  }
}

function flipPlacedLeftOverCard (card: CardKey) {
  return {
    types: [FLIP_PLACED_LEFT_OVER_CARD_REQUEST, FLIP_PLACED_LEFT_OVER_CARD_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const [id, username] = getGameIdAndCurrentPlayerUsername(getState())
      return request.put(`${gamesUrl}/${id}/flip-left-over-card`, { card, username })
    }
  }
}

function movePlacedCard (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) {
  return {
    types: [MOVE_PLACED_CARD_REQUEST, MOVE_PLACED_CARD_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const [id, username] = getGameIdAndCurrentPlayerUsername(getState())
      return request.put(`${gamesUrl}/${id}/move-card`, { card, username, fromSetId, toSetId })
    }
  }
}

function movePlacedLeftOverCard (card: CardKey, toSetId: PropertySetId) {
  return {
    types: [MOVE_PLACED_LEFT_OVER_CARD_REQUEST, MOVE_PLACED_LEFT_OVER_CARD_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const [id, username] = getGameIdAndCurrentPlayerUsername(getState())
      return request.put(`${gamesUrl}/${id}/move-left-over-card`, { card, username, toSetId })
    }
  }
}

function setWinner (winner: Username) {
  return {
    types: [SET_WINNER_REQUEST, SET_WINNER_SUCCESS, ERROR],
    winner,
    promise: (dispatch: Function, getState: Function) => {
      const id = getState().currentGame.game.id
      return request.put(`${gamesUrl}/${id}/winner`, { winner })
    }
  }
}

function resetCurrentGame (socket: Socket) {
  return (dispatch: Function, getState: Function) => {
    const gameId = getState().currentGame.game.id
    socket.off(`game-${gameId}-change`)
    socket.off(`game-${gameId}-player-change`)

    dispatch(gameHistoryActions.unsubscribeGameHistoryEvent(socket, gameId))
    dispatch(sayNoActions.unsubscribeSayNoEvent(socket, gameId))
    dispatch(cardRequestActions.unsubscribeCardRequestEvent(socket, gameId))
    dispatch({ type: RESET })
    dispatch(paymentActions.reset())
    dispatch(gameHistoryActions.reset())
    dispatch(currentPlayerCardsOnHandActions.reset())
    dispatch(sayNoActions.reset())
  }
}

function subscribeGameEvents (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.on(`game-${gameId}-change`, onGameChange.bind(this, dispatch))
    socket.on(`game-${gameId}-player-change`, onGamePlayerChange.bind(this, dispatch, getState))
    dispatch(gameHistoryActions.subscribeGameHistoryEvent(socket, gameId))
    dispatch(sayNoActions.subscribeSayNoEvent(socket, gameId))
    dispatch(cardRequestActions.subscribeCardRequestEvent(socket, gameId))
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

  if (change.payeeInfoUpdated && change.new_val) {
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

export const actions = {
  getGame,
  join,
  endTurn,
  setWinner,
  flipPlacedCard,
  flipPlacedLeftOverCard,
  movePlacedCard,
  movePlacedLeftOverCard,
  resetCurrentGame,
  subscribeGameEvents
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
const nextStateRelyOnWebSocket = (state: CurrentGameState) => state

export default function reducer (state: CurrentGameState = initialState, action: ReduxAction) {
  switch (action.type) {
    case LOAD_REQUEST:
    case END_TURN_REQUEST:
    case SET_WINNER_REQUEST:
    case FLIP_PLACED_CARD_REQUEST:
    case FLIP_PLACED_LEFT_OVER_CARD_REQUEST:
    case MOVE_PLACED_CARD_REQUEST:
    case MOVE_PLACED_LEFT_OVER_CARD_REQUEST:
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

    case SET_WINNER_SUCCESS: {
      const nextState = deepmerge(state)
      nextState.game.winner = action.winner
      return nextState
    }

    case MOVE_PLACED_CARD_SUCCESS:
    case MOVE_PLACED_LEFT_OVER_CARD_SUCCESS:
    case FLIP_PLACED_CARD_SUCCESS:
    case FLIP_PLACED_LEFT_OVER_CARD_SUCCESS:
      return nextStateRelyOnWebSocket(state)

    case RESET:
      return {
        ...initialState,
        membership: state.membership
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
