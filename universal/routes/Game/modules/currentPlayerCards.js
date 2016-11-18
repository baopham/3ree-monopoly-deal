import _ from 'lodash'
import { namespace, deepmerge, apiUrl } from '../../../ducks-utils'
import * as request from '../../../request-util'

function ns (value) {
  return namespace('PLAYER', value)
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
const GIVE_CARD_TO_OTHER_MEMBER_REQUEST = ns('GIVE_CARD_TO_OTHER_MEMBER_REQUEST')
const GIVE_CARD_TO_OTHER_MEMBER_SUCCESS = ns('GIVE_CARD_TO_OTHER_MEMBER_SUCCESS')
const ERROR = ns('ERROR')

// ------------------------------------
// Actions
// ------------------------------------
function drawCards () {
  return {
    types: [DRAW_CARDS_REQUEST, DRAW_CARDS_SUCCESS, ERROR],
    promise: (dispatch, getState) => {
      const gameId = getState().currentGame.game.id
      return request.get(`${gamesUrl}/${gameId}/draw`)
    }
  }
}

function discardCard (card) {
  return {
    types: [DISCARD_CARD_REQUEST, DISCARD_CARD_SUCCESS, ERROR],
    card,
    promise: (dispatch, getState) => {
      const gameId = getState().currentGame.game.id
      return request.put(`${gamesUrl}/${gameId}/discard`, { card })
    }
  }
}

function placeCard (card, asMoney = false) {
  return {
    types: [PLACE_CARD_REQUEST, PLACE_CARD_SUCCESS, ERROR],
    card,
    promise: (dispatch, getState) => {
      const currentGame = getState().currentGame
      const username = currentGame.username
      return request.put(`${gamesUrl}/${currentGame.game.id}/place`, { card, username, asMoney })
    }
  }
}

function playCard (card) {
  return {
    types: [PLAY_CARD_REQUEST, PLAY_CARD_SUCCESS, ERROR],
    card,
    promise: (dispatch, getState) => {
      const currentGame = getState().currentGame
      const username = currentGame.username
      return request.put(`${gamesUrl}/${currentGame.game.id}/play`, { card, username })
    }
  }
}

function endTurn () {
  return {
    types: [END_TURN_REQUEST, END_TURN_SUCCESS, ERROR],
    promise: (dispatch, getState) => {
      const currentGame = getState().currentGame
      return request.put(`${gamesUrl}/${currentGame.game.id}/end-turn`)
    }
  }
}

function giveCardToOtherMember (gameId, card, username) {
  return {
    types: [GIVE_CARD_TO_OTHER_MEMBER_REQUEST, GIVE_CARD_TO_OTHER_MEMBER_SUCCESS, ERROR],
    card,
    username,
    promise: (dispatch, getState) => {
      const gameId = getState().currentGame.game.id
      return request.put(`${gamesUrl}/${gameId}/give`, { card, username })
    }
  }
}

export const actions = {
  drawCards,
  playCard,
  placeCard,
  endTurn,
  discardCard,
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

const requestActionHandler = (state) => deepmerge(state, { isWorking: true, error: null })

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case DRAW_CARDS_REQUEST:
    case DISCARD_CARD_REQUEST:
    case PLACE_CARD_REQUEST:
    case PLAY_CARD_REQUEST:
    case GIVE_CARD_TO_OTHER_MEMBER_REQUEST:
      return requestActionHandler(state)

    case DRAW_CARDS_SUCCESS:
      return {
        ...state,
        cardsOnHand: state.cardsOnHand.concat(action.payload.cards)
      }

    case DISCARD_CARD_SUCCESS:
    case PLACE_CARD_SUCCESS:
    case PLAY_CARD_SUCCESS:
    case GIVE_CARD_TO_OTHER_MEMBER_SUCCESS:
      const { cardsOnHand } = state
      const indexToRemove = cardsOnHand.indexOf(action.card)

      return {
        ...state,
        cardsOnHand: [
          ...cardsOnHand.slice(0, indexToRemove),
          ...cardsOnHand.slice(indexToRemove + 1)
        ]
      }

    default:
      return state
  }
}
