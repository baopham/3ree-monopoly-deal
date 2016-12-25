/* @flow */
import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'

function ns (value) {
  return namespace('PAYMENT', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const PAYMENT_REQUEST = ns('PAYMENT_REQUEST')
const PAY_REQUEST = ns('PAY_REQUEST')
const PAY_SUCCESS = ns('PAY_SUCCESS')
const ERROR = ns('ERROR')
const PAYMENT_UPDATE = ns('PAYMENT_UPDATE')

// ------------------------------------
// Action creators
// ------------------------------------
function requestForPayment (payee: Username, payers: Username[], cardPlayed: CardKey, amount: number) {
  return {
    type: PAYMENT_REQUEST,
    payee,
    payers,
    cardPlayed,
    amount
  }
}

function pay (payer: Username, moneyCards: CardKey[], serializedPropertySets: SerializedPropertySet[]) {
  return {
    types: [PAY_REQUEST, PAY_SUCCESS, ERROR],
    payer,
    promise: (dispatch: Function, getState: Function) => {
      const game = getState().currentGame.game
      const payee = getState().payment.payee
      return request.put(`${gamesUrl}/${game.id}/pay`, { payer, payee, moneyCards, serializedPropertySets })
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

export const actions = {
  requestForPayment,
  pay,
  updatePayment
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
        return initialState
      }

      return {
        ...state,
        payers: state.payers.filter(p => p !== payer)
      }
    }

    case PAYMENT_UPDATE:
      if (!action.payers || !action.payers.length) {
        return initialState
      }

      return {
        payee: action.payee,
        amount: action.amount,
        payers: action.payers,
        cardPlayed: action.cardPlayed
      }

    case ERROR:
      return deepmerge({}, state, { error: action.message })

    default:
      return state
  }
}
