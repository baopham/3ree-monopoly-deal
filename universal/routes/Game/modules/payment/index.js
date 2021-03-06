/* @flow */
import { namespace, deepmerge, apiUrl } from '../../../../ducks-utils'
import * as requestUtils from '../../../../request-util'
import request from 'axios'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

function ns (value) {
  return namespace('PAYMENT', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const LOAD_REQUEST = ns('LOAD_REQUEST')
const LOAD_SUCCESS = ns('LOAD_SUCCESS')
const PAYMENT_REQUEST = ns('PAYMENT_REQUEST')
const PAY_REQUEST = ns('PAY_REQUEST')
const PAY_SUCCESS = ns('PAY_SUCCESS')
const PAYMENT_UPDATE = ns('PAYMENT_UPDATE')
const RESET = ns('RESET')
const ERROR = ns('ERROR')

// ------------------------------------
// Action creators
// ------------------------------------
function getCurrentPaymentInfo () {
  return {
    types: [LOAD_REQUEST, LOAD_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const game = getState().currentGame.game
      return request.get(`${gamesUrl}/${game.id}/payment-info`)
    }
  }
}

function requestForPayment (payee: Username, payers: Username[], cardPlayed: CardKey, amount: number) {
  return {
    type: PAYMENT_REQUEST,
    payee,
    payers,
    cardPlayed,
    amount
  }
}

function pay (
  payer: Username,
  bankCards: CardKey[],
  leftOverCards: CardKey[],
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) {
  return {
    types: [PAY_REQUEST, PAY_SUCCESS, ERROR],
    payer,
    promise: (dispatch: Function, getState: Function) => {
      const game = getState().currentGame.game
      const payee = getState().payment.payee
      return request.put(`${gamesUrl}/${game.id}/pay`, {
        payer,
        payee,
        bankCards,
        leftOverCards,
        mapOfNonMoneyCards: requestUtils.mapToJSON(mapOfNonMoneyCards)
      })
    }
  }
}

function updatePayment (payee: ?Username, payers: ?Username[], amount: ?number, cardPlayed: ?CardKey) {
  return {
    type: PAYMENT_UPDATE,
    payee,
    amount,
    payers,
    cardPlayed
  }
}

function reset () {
  return { type: RESET }
}

export const actions = {
  getCurrentPaymentInfo,
  requestForPayment,
  pay,
  updatePayment,
  reset
}

// ------------------------------------
// Reducer
// ------------------------------------
export type PaymentState = {
  payers: ?Username[],
  payee: ?Username,
  cardPlayed: ?CardKey,
  amount: number
}

const initialState: PaymentState = {
  payers: [],
  payee: null,
  cardPlayed: null,
  amount: 0
}

export default function reducer (state: PaymentState = initialState, action: ReduxAction) {
  switch (action.type) {
    case LOAD_SUCCESS: {
      const { payers, amount, cardPlayed, payee } = action.payload.paymentInfo

      return deepmerge(state, {
        payers,
        amount,
        payee,
        cardPlayed
      })
    }

    case PAYMENT_REQUEST:
      return {
        payers: [...action.payers],
        payee: action.payee,
        cardPlayed: action.cardPlayed,
        amount: action.amount
      }

    case PAY_SUCCESS: {
      const { payer } = action

      if (!state.payers || state.payers.length <= 1) {
        return { ...initialState }
      }

      return {
        ...state,
        payers: state.payers.filter(p => p !== payer)
      }
    }

    case PAYMENT_UPDATE:
      if (!action.payers || !action.payers.length) {
        return { ...initialState }
      }

      return {
        payee: action.payee,
        amount: action.amount,
        payers: action.payers,
        cardPlayed: action.cardPlayed
      }

    case RESET:
      return { ...initialState }

    case ERROR:
      return deepmerge({}, state, { error: action.message })

    default:
      return state
  }
}
