/* @flow */
import { namespace, apiUrl } from '../../../../ducks-utils'
import request from 'axios'
import { getCurrentPlayer } from '../gameSelectors'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import type { DealBreakerInfo } from '../../../../monopoly/cardRequestTypes'

function ns (value) {
  return namespace('DEAL_BREAKER', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const UPDATE = ns('UPDATE')
const ASK_REQUEST = ns('ASK_REQUEST')
const ASK_SUCCESS = ns('ASK_SUCCESS')
const ACCEPT_REQUEST = ns('ACCEPT_REQUEST')
const ACCEPT_SUCCESS = ns('ACCEPT_SUCCESS')
const RESET = ns('RESET')
const ERROR = ns('ERROR')

// ------------------------------------
// Action creators
// ------------------------------------
function onDealBreakerUpdateEvent (change: SocketCardRequestChangeEvent) {
  if (change.deleted) {
    return reset()
  }

  return { type: UPDATE, payload: { cardRequest: change.new_val } }
}

function askToDealBreak (toPlayer: Player, setId: PropertySetId) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const currentPlayer = getCurrentPlayer(getState())

      if (!currentPlayer) {
        throw new Error('No player to perform a deal breaker')
      }

      const payload: DealBreakerInfo = {
        toUser: toPlayer.username,
        fromUser: currentPlayer.username,
        setId
      }
      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request/deal-break`, payload)
    }
  }
}

function acceptDealBreaker (dealBreakerRequestId: string) {
  return {
    types: [ACCEPT_REQUEST, ACCEPT_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame

      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request-accept/deal-breaker/${dealBreakerRequestId}`)
    }
  }
}

function reset () {
  return { type: RESET }
}

export const actions = {
  onDealBreakerUpdateEvent,
  askToDealBreak,
  acceptDealBreaker,
  reset
}

// ------------------------------------
// Reducer
// ------------------------------------
export type DealBreakerState = {
  dealBreakerRequestId: string,
  toUser: ?Username,
  fromUser: ?Username,
  setId: ?PropertySetId,
  isWorking: boolean,
  error: mixed
}

const initialState: DealBreakerState = {
  dealBreakerRequestId: '',
  toUser: null,
  fromUser: null,
  setId: null,
  isWorking: false,
  error: null
}

export default function reducer (state: DealBreakerState = initialState, action: ReduxAction) {
  switch (action.type) {
    case ASK_REQUEST:
      return {
        ...initialState,
        isWorking: true
      }

    case UPDATE:
    case ASK_SUCCESS:
      const { cardRequest }: { cardRequest: CardRequest } = action.payload
      const { info }: { info: DealBreakerInfo } = cardRequest
      return {
        ...initialState,
        ...info,
        dealBreakerRequestId: cardRequest.id
      }

    case ACCEPT_REQUEST:
      return {
        ...state,
        isWorking: true,
        error: null
      }

    case ACCEPT_SUCCESS:
      return { ...initialState }

    case RESET:
      return { ...initialState }

    default:
      return state
  }
}

