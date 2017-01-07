/* @flow */
import { namespace, deepmerge } from '../../../ducks-utils'
import { actions as paymentActions } from './payment'
import { actions as gameHistoryActions } from './gameHistory'
import { actions as currentPlayerCardsOnHandActions } from './currentPlayerCardsOnHand'
import { actions as sayNoActions } from './sayNo'
import type { PropertySetId } from '../../../monopoly/PropertySet'

function ns (value) {
  return namespace('GAME', value)
}

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_GAME = ns('UPDATE_GAME')
export const UPDATE_PLAYER = ns('UPDATE_PLAYER')
export const LOAD_REQUEST = ns('LOAD_REQUEST')
export const LOAD_SUCCESS = ns('LOAD_SUCCESS')
export const JOIN_REQUEST = ns('JOIN_REQUEST')
export const JOIN_SUCCESS = ns('JOIN_SUCCESS')
export const JOIN_ERROR = ns('JOIN_ERROR')
export const LEAVE_SUCCESS = ns('LEAVE_SUCCESS')
export const END_TURN_REQUEST = ns('END_TURN_REQUEST')
export const END_TURN_SUCCESS = ns('END_TURN_SUCCESS')
export const SET_WINNER_REQUEST = ns('SET_WINNER_REQUEST')
export const SET_WINNER_SUCCESS = ns('SET_WINNER_SUCCESS')
export const FLIP_PLACED_CARD_REQUEST = ns('FLIP_PLACED_CARD_REQUEST')
export const FLIP_PLACED_CARD_SUCCESS = ns('FLIP_PLACED_CARD_SUCCESS')
export const FLIP_PLACED_LEFT_OVER_CARD_REQUEST = ns('FLIP_PLACED_LEFT_OVER_CARD_REQUEST')
export const FLIP_PLACED_LEFT_OVER_CARD_SUCCESS = ns('FLIP_PLACED_LEFT_OVER_CARD_SUCCESS')
export const MOVE_PLACED_CARD_REQUEST = ns('MOVE_PLACED_CARD_REQUEST')
export const MOVE_PLACED_CARD_SUCCESS = ns('MOVE_PLACED_CARD_SUCCESS')
export const MOVE_PLACED_LEFT_OVER_CARD_REQUEST = ns('MOVE_PLACED_LEFT_OVER_CARD_REQUEST')
export const MOVE_PLACED_LEFT_OVER_CARD_SUCCESS = ns('MOVE_PLACED_LEFT_OVER_CARD_SUCCESS')
export const RESET = ns('RESET')
export const ERROR = ns('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
function getGame (id: string) {
  return { type: LOAD_REQUEST, id }
}

function join (username: Username) {
  return { type: JOIN_REQUEST, username }
}

function endTurn () {
  return { type: END_TURN_REQUEST }
}

function flipPlacedCard (card: CardKey, propertySetId: PropertySetId) {
  return { type: FLIP_PLACED_CARD_REQUEST, card, propertySetId }
}

function flipPlacedLeftOverCard (card: CardKey) {
  return { type: FLIP_PLACED_LEFT_OVER_CARD_REQUEST, card }
}

function movePlacedCard (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) {
  return { type: MOVE_PLACED_CARD_REQUEST, card, fromSetId, toSetId }
}

function movePlacedLeftOverCard (card: CardKey, toSetId: PropertySetId) {
  return { type: MOVE_PLACED_LEFT_OVER_CARD_REQUEST, card, toSetId }
}

function setWinner (winner: Username) {
  return { type: SET_WINNER_REQUEST, winner }
}

function resetCurrentGame (socket: Socket) {
  return (dispatch: Function, getState: Function) => {
    const gameId = getState().currentGame.game.id
    socket.off(`game-${gameId}-change`)
    socket.off(`game-${gameId}-player-change`)

    dispatch(gameHistoryActions.unsubscribeGameHistoryEvent(socket, gameId))
    dispatch(sayNoActions.unsubscribeSayNoEvent(socket, gameId))
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
