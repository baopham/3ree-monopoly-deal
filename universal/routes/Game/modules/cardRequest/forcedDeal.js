/* @flow */
import { namespace, apiUrl } from '../../../../ducks-utils'
import * as request from '../../../../request-util'
import { getCurrentPlayer } from '../gameSelectors'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import type { ForcedDealInfo } from '../../../../monopoly/cardRequestTypes'

function ns (value) {
  return namespace('FORCED_DEAL', value)
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
function onForcedDealUpdateEvent (change: SocketCardRequestChangeEvent) {
  if (change.deleted) {
    return reset()
  }

  return { type: UPDATE, payload: { cardRequest: change.new_val } }
}

function askToForceDeal (
  toPlayer: Player,
  toPlayerSetId: PropertySetId,
  toPlayerCard: CardKey,
  fromPlayerSetId: PropertySetId,
  fromPlayerCard: CardKey
) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const currentPlayer = getCurrentPlayer(getState())
      const payload: ForcedDealInfo = {
        toUser: toPlayer.username,
        fromUser: currentPlayer.username,
        toUserSetId: toPlayerSetId,
        fromUserSetId: fromPlayerSetId,
        toUserCard: toPlayerCard,
        fromUserCard: fromPlayerCard
      }
      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request/force-deal`, payload)
    }
  }
}

function acceptForcedDeal (forcedDealRequestId: string) {
  return {
    types: [ACCEPT_REQUEST, ACCEPT_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame

      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request-accept/forced-deal/${forcedDealRequestId}`)
    }
  }
}

function reset () {
  return { type: RESET }
}

export const actions = {
  onForcedDealUpdateEvent,
  askToForceDeal,
  acceptForcedDeal,
  reset
}

// ------------------------------------
// Reducer
// ------------------------------------
export type ForcedDealState = {
  forcedDealRequestId: string,
  toUser: ?Username,
  fromUser: ?Username,
  fromUserSetId: ?PropertySetId,
  toUserSetId: ?PropertySetId,
  fromUserCard: ?CardKey,
  toUserCard: ?CardKey,
  isWorking: boolean,
  error: mixed
}

const initialState: ForcedDealState = {
  forcedDealRequestId: '',
  toUser: null,
  fromUser: null,
  fromUserSetId: null,
  toUserSetId: null,
  fromUserCard: null,
  toUserCard: null,
  isWorking: false,
  error: null
}

export default function reducer (state: ForcedDealState = initialState, action: ReduxAction) {
  switch (action.type) {
    case ASK_REQUEST:
      return {
        ...initialState,
        isWorking: true
      }

    case UPDATE:
    case ASK_SUCCESS:
      const { cardRequest }: { cardRequest: CardRequest } = action.payload
      const { info }: { info: ForcedDealInfo } = cardRequest
      return {
        ...initialState,
        ...info,
        forcedDealRequestId: cardRequest.id
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

