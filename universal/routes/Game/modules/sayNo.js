/* @flow */
import * as request from '../../../request-util'
import { namespace, apiUrl } from '../../../ducks-utils'
import { getCurrentPlayer } from './gameSelectors'
import sayNoCauses from '../../../monopoly/sayNoCauses'
import type { SayNoCause, SayNoCauseInfo } from '../../../monopoly/sayNoCauses'

function ns (value) {
  return namespace('SAY_NO', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const SAY_NO_REQUEST = ns('REQUEST')
const SAY_NO_SUCCESS = ns('SUCCESS')
const ACCEPT_REQUEST = ns('ACCEPT_REQUEST')
const ACCEPT_SUCCESS = ns('ACCEPT_SUCCESS')
const SAY_NO_UPDATE = ns('UPDATE')
const RESET = ns('RESET')
const ERROR = ns('ERROR')

// ------------------------------------
// Action creators
// ------------------------------------
function sayNo (toUser: Username, onSuccess: Function, cause: SayNoCause) {
  return (dispatch: Function, getState: Function) => {
    const currentGame = getState().currentGame
    const currentPlayer = getCurrentPlayer(getState())
    const fromUser = currentPlayer.username
    const causeInfo = getCauseInfo(getState, fromUser, toUser, cause)

    dispatch({ type: SAY_NO_REQUEST, fromUser, toUser, cause, causeInfo })

    return request
      .put(`${gamesUrl}/${currentGame.game.id}/say-no/${fromUser}/${toUser}`, { cause, causeInfo })
      .then(handleSuccessRequest)
      .catch(handleErrorRequest)

    //////
    function handleSuccessRequest (res) {
      dispatch({ type: SAY_NO_SUCCESS, fromUser, toUser, cause, causeInfo })
      onSuccess()
    }

    function handleErrorRequest (error) {
      dispatch({ type: ERROR, error })
    }
  }
}

function getCauseInfo (getState: Function, fromUser: Username, toUser: Username, cause: SayNoCause): SayNoCauseInfo {
  switch (cause) {
    case sayNoCauses.PAYMENT:
      const { payment } = getState()
      return {
        payer: payment.payers.find(p => p === fromUser || p === toUser),
        payee: payment.payee
      }

    default:
      return null
  }
}

function acceptSayNo () {
  return {
    types: [ACCEPT_REQUEST, ACCEPT_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const sayNo = getState().sayNo
      return request.put(`${gamesUrl}/${currentGame.game.id}/accept-say-no/${sayNo.fromUser}/${sayNo.toUser}`)
    }
  }
}

function updateSayNoState (sayNo: SayNo) {
  return {
    type: SAY_NO_UPDATE,
    ...sayNo
  }
}

function subscribeSayNoEvent (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.on(`game-${gameId}-say-no-update`, onSayNoUpdate.bind(this, dispatch, getState))
  }
}

function unsubscribeSayNoEvent (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.off(`game-${gameId}-say-no-update`)
  }
}

function onSayNoUpdate (dispatch: Function, getState: Function, sayNo: SayNo) {
  dispatch(updateSayNoState(sayNo))
}

function reset () {
  return { type: RESET }
}

export const actions = {
  sayNo,
  updateSayNoState,
  acceptSayNo,
  reset,
  subscribeSayNoEvent,
  unsubscribeSayNoEvent
}

// ------------------------------------
// Reducer
// ------------------------------------
export type SayNoState = {
  fromUser: ?Username,
  toUser: ?Username,
  cause: ?SayNoCause,
  causeInfo: ?SayNoCauseInfo,
  isWorking: boolean,
  error: mixed
}

const initialState: SayNoState = {
  fromUser: null,
  toUser: null,
  cause: null,
  causeInfo: null,
  isWorking: false,
  error: null
}

export default function reducer (state: SayNoState = initialState, action: ReduxAction) {
  switch (action.type) {
    case SAY_NO_REQUEST:
    case ACCEPT_REQUEST:
      return { ...state, isWorking: true }

    case SAY_NO_SUCCESS:
      return {
        ...initialState,
        fromUser: action.fromUser,
        toUser: action.toUser,
        cause: action.cause,
        causeInfo: action.causeInfo,
        isWorking: false
      }

    case ACCEPT_SUCCESS:
      return initialState

    case SAY_NO_UPDATE:
      return {
        ...initialState,
        fromUser: action.fromUser,
        toUser: action.toUser,
        cause: action.cause,
        causeInfo: action.causeInfo,
        isWorking: false
      }

    case ERROR:
      return {
        ...initialState,
        error: action.error
      }

    case RESET:
      return initialState

    default:
      return state
  }
}
