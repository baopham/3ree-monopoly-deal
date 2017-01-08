/* @flow */
import { namespace, deepmerge, apiUrl } from '../../../../ducks-utils'
import * as request from '../../../../request-util'
import { PASS_GO } from '../../../../monopoly/cards'
import * as monopoly from '../../../../monopoly/monopoly'
import { actions as paymentActions } from '../payment'
import { getCurrentPlayer } from '../gameSelectors'

function ns (value) {
  return namespace('CARDS_ON_HAND', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const DRAW_CARDS_REQUEST = ns('DRAW_CARDS_REQUEST')
const DRAW_CARDS_SUCCESS = ns('DRAW_CARDS_SUCCESS')
const DISCARD_CARD_REQUEST = ns('DISCARD_CARD_REQUEST')
const DISCARD_CARD_SUCCESS = ns('DISCARD_CARD_SUCCESS')
const PLACE_CARD_REQUEST = ns('PLACE_CARD_REQUEST')
const PLACE_CARD_SUCCESS = ns('PLACE_CARD_SUCCESS')
const PLAY_CARD_REQUEST = ns('PLAY_CARD_REQUEST')
const PLAY_CARD_SUCCESS = ns('PLAY_CARD_SUCCESS')
const FLIP_CARD_ON_HAND = ns('FLIP_CARD_ON_HAND')
const RESET = ns('RESET')
const ERROR = ns('ERROR')

// ------------------------------------
// Actions
// ------------------------------------
function drawCards () {
  return {
    types: [DRAW_CARDS_REQUEST, DRAW_CARDS_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const gameId = getState().currentGame.game.id
      return request.get(`${gamesUrl}/${gameId}/draw`)
    }
  }
}

function discardCard (card: CardKey) {
  return {
    types: [DISCARD_CARD_REQUEST, DISCARD_CARD_SUCCESS, ERROR],
    card,
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const username = getCurrentPlayer(getState()).username
      return request.put(`${gamesUrl}/${currentGame.game.id}/discard`, { username, card })
    }
  }
}

function placeCard (card: CardKey, asMoney: boolean = false, setToPutIn?: SerializedPropertySet) {
  return {
    types: [PLACE_CARD_REQUEST, PLACE_CARD_SUCCESS, ERROR],
    card,
    promise: (dispatch: Function, getState: Function) => {
      const currentGame = getState().currentGame
      const username = getCurrentPlayer(getState()).username
      return request.put(`${gamesUrl}/${currentGame.game.id}/place`, { card, username, asMoney, setToPutIn })
    }
  }
}

function playCard (card: CardKey) {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: PLAY_CARD_REQUEST })

    const currentGame = getState().currentGame
    const currentPlayer = getCurrentPlayer(getState())

    return request
      .put(`${gamesUrl}/${currentGame.game.id}/play`, { card, username: currentPlayer.username })
      .then(handleSuccessRequest, handleErrorRequest)

    function handleSuccessRequest (res) {
      dispatch({ type: PLAY_CARD_SUCCESS, payload: res.body, card })
      card === PASS_GO && dispatch(drawCards())

      if (monopoly.cardRequiresPayment(card)) {
        const payee: Player = currentGame.game.players.find(player => player.username === currentPlayer.username)

        const payers: Player[] = currentGame.game.players
          .filter(player => player.username !== payee.username)

        const amount = monopoly.getCardPaymentAmount(card, payee.placedCards.serializedPropertySets)

        dispatch(paymentActions.requestForPayment(payee.username, payers.map(p => p.username), card, amount))
      }
    }

    function handleErrorRequest (error) {
      dispatch({ type: ERROR, error })
    }
  }
}

function flipCardOnHand (card: CardKey) {
  return {
    type: FLIP_CARD_ON_HAND,
    card,
    flippedCard: monopoly.flipCard(card)
  }
}

function reset () {
  return { type: RESET }
}

export const actions = {
  reset,
  drawCards,
  playCard,
  placeCard,
  discardCard,
  flipCardOnHand
}

// ------------------------------------
// Reducer
// ------------------------------------
export type CurrentPlayerCardsOnHandState = {
  cardsOnHand: CardKey[],
  isWorking: boolean,
  error: mixed
}

const initialState: CurrentPlayerCardsOnHandState = {
  cardsOnHand: [],
  isWorking: false,
  error: null
}

export default function reducer (state: CurrentPlayerCardsOnHandState = initialState, action: ReduxAction) {
  switch (action.type) {
    case DRAW_CARDS_REQUEST:
    case DISCARD_CARD_REQUEST:
    case PLACE_CARD_REQUEST:
    case PLAY_CARD_REQUEST:
      return deepmerge(state, { isWorking: true, error: null })

    case DRAW_CARDS_SUCCESS:
      return {
        ...state,
        cardsOnHand: state.cardsOnHand.concat(action.payload.cards)
      }

    case FLIP_CARD_ON_HAND: {
      const nextState = deepmerge(state)
      const indexToFlip = nextState.cardsOnHand.indexOf(action.card)
      nextState.cardsOnHand[indexToFlip] = action.flippedCard
      return nextState
    }

    case DISCARD_CARD_SUCCESS:
    case PLACE_CARD_SUCCESS:
    case PLAY_CARD_SUCCESS: {
      const { cardsOnHand } = state
      const indexToRemove = cardsOnHand.indexOf(action.card)

      return {
        ...state,
        cardsOnHand: [
          ...cardsOnHand.slice(0, indexToRemove),
          ...cardsOnHand.slice(indexToRemove + 1)
        ]
      }
    }

    case RESET:
      return { ...initialState }

    default:
      return state
  }
}
