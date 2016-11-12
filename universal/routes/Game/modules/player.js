import _ from 'lodash'
import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'

function ns (value) {
  return namespace('PLAYER', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gameUrl = `${apiUrl}/game`

const DRAW_CARDS_REQUEST = ns('DRAW_CARDS_REQUEST')
const DRAW_CARDS_SUCCESS = ns('DRAW_CARDS_SUCCESS')
const DISCARD_CARD_REQUEST = ns('DISCARD_CARD_REQUEST')
const DISCARD_CARD_SUCCESS = ns('DISCARD_CARD_SUCCESS')
const PLACE_CARD_REQUEST = ns('PLACE_CARD_REQUEST')
const PLACE_CARD_SUCCESS = ns('PLACE_CARD_SUCCESS')
const GIVE_CARD_TO_OTHER_MEMBER_REQUEST = ns('GIVE_CARD_TO_OTHER_MEMBER_REQUEST')
const GIVE_CARD_TO_OTHER_MEMBER_SUCCESS = ns('GIVE_CARD_TO_OTHER_MEMBER_SUCCESS')
const ERROR = ns('ERROR')

// ------------------------------------
// Actions
// ------------------------------------
function drawCards (gameId) {
  return {
    types: [DRAW_CARDS_REQUEST, DRAW_CARDS_SUCCESS, ERROR],
    promise: request.get(`${gameUrl}/gameId/draw`)
  }
}

function discardCard (gameId, card) {
  return {
    types: [DISCARD_CARD_REQUEST, DISCARD_CARD_SUCCESS, ERROR],
    card,
    promise: () => request.put(`${gameUrl}/${gameId}/discard`, { card })
  }
}

function placeCard (gameId, card) {
  return {
    types: [PLACE_CARD_REQUEST, PLACE_CARD_SUCCESS, ERROR],
    card,
    promise: () => request.put(`${gameUrl}/${gameId}/place`, { card })
  }
}

function giveCardToOtherMember (gameId, card, username) {
  return {
    types: [GIVE_CARD_TO_OTHER_MEMBER_REQUEST, GIVE_CARD_TO_OTHER_MEMBER_SUCCESS, ERROR],
    card,
    username,
    promise: () => request.put(`${gameUrl}/${gameId}/give`, { card, username })
  }
}

export const actions = {
  drawCards,
  placeCard,
  discardCard,
  placeCard,
  giveCardToOtherMember
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  cardsOnHand: [],
  isWorking: false,
  error: null
}

const requestActionHandler = (state) => ({ ...state, isWorking: true, error: null })

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case DRAW_CARDS_REQUEST:
    case DISCARD_CARD_REQUEST:
    case PLACE_CARD_REQUEST:
    case GIVE_CARD_TO_OTHER_MEMBER_REQUEST:
      return requestActionHandler(state)

    case DRAW_CARDS_SUCCESS:
      return {
        ...state,
        cardsOnHand: state.cardsOnHand.concat(action.cards)
      }

    case DISCARD_CARD_SUCCESS:
    case PLACE_CARD_SUCCESS:
    case GIVE_CARD_TO_OTHER_MEMBER_SUCCESS:
      return {
        ...state,
        cardsOnHand: _.omit(state.cardsOnHand, action.card)
      }

    default:
      return state
  }
}
