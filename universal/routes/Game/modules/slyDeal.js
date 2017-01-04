/* @flow */
import { namespace, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'
import PropertySet from '../../../monopoly/PropertySet'

function ns (value) {
  return namespace('SLY_DEAL', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const ASK_REQUEST = ns('ASK_REQUEST')
const ASK_SUCCESS = ns('ASK_SUCCESS')
const ACCEPT_REQUEST = ns('ACCEPT_REQUEST')
const ACCEPT_SUCCESS = ns('ACCEPT_SUCCESS')
const ERROR = ns('ERROR')

// ------------------------------------
// Action creators
// ------------------------------------
function askToSlyDeal (otherPlayer: Player, fromSet: PropertySet, cardToSlyDeal: CardKey) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame

      return request.put(`${gamesUrl}/${currentGame.game.id}/ask-to-sly-deal`, {
        otherPlayerUsername: otherPlayer.username,
        fromSetId: fromSet.getId(),
        cardToSlyDeal
      })
    }
  }
}

function acceptSlyDeal (slyDealId: string) {
  return {
    types: [ACCEPT_REQUEST, ACCEPT_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame

      return request.put(`${gamesUrl}/${currentGame.game.id}/accept-sly-deal/${slyDealId}`)
    }
  }
}

export const actions = {
  askToSlyDeal,
  acceptSlyDeal
}

// ------------------------------------
// Reducer
// ------------------------------------
export type SlyDealState = {
  toUser: ?Username,
  fromUser: ?Username,
  slyDealId: ?string,
  isWorking: boolean,
  error: mixed
}

const initialState = {
  toUser: null,
  fromUser: null,
  slyDealId: null,
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
        slyDealId: action.payload.slyDealId
      }

    case ACCEPT_REQUEST:
      return {
        ...state,
        isWorking: false,
        error: null
      }

    case ACCEPT_SUCCESS:
      return { ...initialState }

    default:
      return state
  }
}
