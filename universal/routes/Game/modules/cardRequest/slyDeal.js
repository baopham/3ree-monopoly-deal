/* @flow */
import { namespace, apiUrl } from '../../../../ducks-utils'
import request from 'axios'
import { getCurrentPlayer } from '../gameSelectors'
import PropertySet from '../../../../monopoly/PropertySet'
import { SetCardType, LeftOverCardType } from '../../../../monopoly/cardRequestTypes'
import { SLY_DEAL } from '../../../../monopoly/cards'
import { DISCARD_CARD_SUCCESS } from '../currentPlayerCardsOnHand'
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
function onSlyDealUpdateEvent (change: SocketCardRequestChangeEvent) {
  if (change.deleted) {
    return reset()
  }

  return { type: UPDATE, payload: { cardRequest: change.new_val } }
}

function askToSlyDealSetCard (playerToSlyDealFrom: Player, fromSet: PropertySet, cardToSlyDeal: CardKey) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const currentPlayer = getCurrentPlayer(getState())

      if (!currentPlayer) {
        throw new Error('No player to perform the sly deal')
      }

      const payload: SlyDealInfo = {
        toUser: playerToSlyDealFrom.username,
        fromUser: currentPlayer.username,
        setId: fromSet.getId(),
        cardType: SetCardType,
        card: cardToSlyDeal
      }

      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request/sly-deal`, payload)
        .then(res => {
          dispatch({ type: DISCARD_CARD_SUCCESS, card: SLY_DEAL })
          return res
        })
    }
  }
}

function askToSlyDealLeftOverCard (playerToSlyDealFrom: Player, wildcardToSlyDeal: CardKey) {
  return {
    types: [ASK_REQUEST, ASK_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const currentPlayer = getCurrentPlayer(getState())

      if (!currentPlayer) {
        throw new Error('No player to perform the sly deal')
      }

      const payload: SlyDealInfo = {
        toUser: playerToSlyDealFrom.username,
        fromUser: currentPlayer.username,
        setId: null,
        cardType: LeftOverCardType,
        card: wildcardToSlyDeal
      }

      return request.put(`${gamesUrl}/${currentGame.game.id}/card-request/sly-deal`, payload)
        .then(res => {
          dispatch({ type: DISCARD_CARD_SUCCESS, card: SLY_DEAL })
          return res
        })
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
  askToSlyDealSetCard,
  askToSlyDealLeftOverCard,
  acceptSlyDeal,
  reset
}

// ------------------------------------
// Reducer
// ------------------------------------
export type SlyDealState = {
  slyDealRequestId: string,
  toUser: ?Username,
  fromUser: ?Username,
  setId: ?PropertySetId,
  card: ?CardKey,
  isWorking: boolean,
  error: mixed
}

const initialState: SlyDealState = {
  slyDealRequestId: '',
  toUser: null,
  fromUser: null,
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
