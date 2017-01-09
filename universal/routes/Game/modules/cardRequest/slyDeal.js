/* @flow */
import { namespace, apiUrl } from '../../../../ducks-utils'
import * as request from '../../../../request-util'
import { getCurrentPlayer } from '../gameSelectors'
import PropertySet from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import type { SlyDealInfo } from '../../../../monopoly/cardRequestTypes'

function ns (value) {
  return namespace('SLY_DEAL', value)
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
function onSlyDealUpdateEvent (change: Object) {
  if (change.deleted) {
    return reset()
  }

  return { type: UPDATE, payload: { cardRequest: change.new_val } }
}

function askToSlyDeal (playerToSlyDealFrom: Player, fromSet: PropertySet, cardToSlyDeal: CardKey) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const currentPlayer = getCurrentPlayer(getState())
      const payload: SlyDealInfo = {
        toUser: playerToSlyDealFrom.username,
        fromUser: currentPlayer.username,
        setId: fromSet.getId(),
        card: cardToSlyDeal
      }
      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request/sly-deal`, payload)
    }
  }
}

function acceptSlyDeal (slyDealRequestId: string) {
  return {
    types: [ACCEPT_REQUEST, ACCEPT_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame

      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request-accept/sly-deal/${slyDealRequestId}`)
    }
  }
}

function reset () {
  return { type: RESET }
}

export const actions = {
  onSlyDealUpdateEvent,
  askToSlyDeal,
  acceptSlyDeal,
  reset
}

// ------------------------------------
// Reducer
// ------------------------------------
export type SlyDealState = {
  toUser: ?Username,
  fromUser: ?Username,
  slyDealRequestId: string,
  setId: ?PropertySetId,
  card: ?CardKey,
  isWorking: boolean,
  error: mixed
}

const initialState: SlyDealState = {
  toUser: null,
  fromUser: null,
  slyDealRequestId: '',
  setId: null,
  card: null,
  isWorking: false,
  error: null
}

export default function reducer (state: SlyDealState = initialState, action: ReduxAction) {
  switch (action.type) {
    case ASK_REQUEST:
      return {
        ...initialState,
        isWorking: true
      }

    case UPDATE:
    case ASK_SUCCESS:
      const { cardRequest }: { cardRequest: CardRequest } = action.payload
      const { info }: { info: SlyDealInfo } = cardRequest
      return {
        ...initialState,
        toUser: info.toUser,
        fromUser: info.fromUser,
        slyDealRequestId: cardRequest.id,
        setId: info.setId,
        card: info.card
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
