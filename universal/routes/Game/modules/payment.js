/* @flow */
import { namespace, deepmerge } from '../../../ducks-utils'

function ns (value) {
  return namespace('PAYMENT', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const PAYMENT_REQUEST = ns('PAYMENT_REQUEST')
const PAY = ns('PAY')
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

function pay (payer: Username, amount: number) {
  return (dispatch: Function, getState: Function) => {
    const paymentState = getState().payment

    if (amount < paymentState.amount) {
      dispatch(error(`Need to pay at least ${paymentState.amount}`))
      return
    }

    if (!paymentState.payers.find(p => p === payer)) {
      dispatch(error('Wrong payer'))
      return
    }

    dispatch({
      type: PAY,
      payer
    })
  }
}

function updatePayment (payee: Username, payers: Username[], amount: number, cardPlayed: CardKey) {
  return {
    type: PAYMENT_UPDATE,
    payee,
    amount,
    payers,
    cardPlayed
  }
}

function error (message) {
  return {
    type: ERROR,
    message
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
  payers: Username[],
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

    case PAY: {
      const { payer } = action
      const payerIndex = state.payers.findIndex(p => p === payer)

      if (state.payers.length === 1) {
        return initialState
      }

      return {
        ...state,
        payers: [
          ...state.payers.slice(0, payerIndex),
          ...state.payers.slice(payerIndex + 1)
        ]
      }
    }

    case PAYMENT_UPDATE:
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
