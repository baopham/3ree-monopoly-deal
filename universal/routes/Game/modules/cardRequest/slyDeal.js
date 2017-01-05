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
const ERROR = ns('ERROR')

// ------------------------------------
// Action creators
// ------------------------------------
function updateSlyDealRequest (info: SlyDealInfo) {
  return {
    type: UPDATE,
    ...info
  }
}

function askToSlyDeal (otherPlayer: Player, fromSet: PropertySet, cardToSlyDeal: CardKey) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const currentPlayer = getCurrentPlayer(getState())
      const payload: SlyDealInfo = {
        toUser: otherPlayer.username,
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

export const actions = {
  updateSlyDealRequest,
  askToSlyDeal,
  acceptSlyDeal
}

// ------------------------------------
// Reducer
// ------------------------------------
export type SlyDealState = {
  toUser: ?Username,
  fromUser: ?Username,
  slyDealRequestId: ?string,
  setId: ?PropertySetId,
  card: ?CardKey,
  isWorking: boolean,
  error: mixed
}

const initialState: SlyDealState = {
  toUser: null,
  fromUser: null,
  slyDealRequestId: null,
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

    case ASK_SUCCESS:
      return {
        ...initialState,
        toUser: action.payload.toUser,
        fromUser: action.payload.fromUser,
        slyDealRequestId: action.payload.id,
        setId: action.payload.setId,
        card: action.payload.card
      }

    case ACCEPT_REQUEST:
      return {
        ...state,
        isWorking: true,
        error: null
      }

    case ACCEPT_SUCCESS:
      return { ...initialState }

    case UPDATE:
      return {
        ...initialState,
        toUser: action.toUser,
        fromUser: action.fromUser,
        slyDealRequestId: action.id,
        setId: action.payload.setId,
        card: action.payload.card
      }

    default:
      return state
  }
}
