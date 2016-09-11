import { namespace, deepmerge, apiUrl } from './util'
import * as request from '../request-util'

function namespacedConstant (value) {
  return namespace('GAME', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`

const LOAD_REQUEST = namespacedConstant('LOAD_REQUEST')
const LOAD_SUCCESS = namespacedConstant('LOAD_SUCCESS')
const JOIN_REQUEST = namespacedConstant('JOIN_REQUEST')
const JOIN_SUCCESS = namespacedConstant('JOIN_SUCCESS')
const LEAVE_REQUEST = namespacedConstant('LEAVE_REQUEST')
const LEAVE_SUCCESS = namespacedConstant('LEAVE_SUCCESS')
const DRAW_CARD_SUCCESS = namespacedConstant('DRAW_CARD_SUCCESS')
const DISCARD_CARD_SUCCESS = namespacedConstant('DISCARD_CARD_SUCCESS')
const GIVE_CARD_TO_OTHER_MEMBER_SUCCESS = namespacedConstant('GIVE_CARD_TO_OTHER_MEMBER_SUCCESS')
const ERROR = namespacedConstant('ERROR')

// ------------------------------------
// Action Creators
// ------------------------------------
function getGame (id) {
  return (dispatch) => {
    dispatch(loadRequest(id))

    return request
      .get(`${gamesUrl}/${id}`)
      .end((err, res) => {
        err ? dispatch(error(err)) : loadSuccess(res.body)
      })
  }
}

function join (username) {
  return (dispatch, getState) => {
    const id = getState().currentGame.game.id

    dispatch(joinRequest(username))

    return request
      .post(`${gamesUrl}/${id}/join`, { username })
      .end((err, res) => {
        err ? dispatch(error(err)) : joinSuccess(res.body)
      })
  }
}

function leave (name) {
  return (dispatch) => {
    return request
      .post(`${gamesUrl}/${id}/leave`, { username })
      .end((err, res) => {
        err ? dispatch(error(err)) : leaveSuccess(res.body)
      })
  }
}

function drawCard (card) {
  // TODO
}

function discardCard (card) {
  // TODO
}

function placeCard (card) {
  // TODO
}

function giveCardToOtherMember (card, username) {
  // TODO
}

const loadRequest = (id) => ({ type: LOAD_REQUEST, id })
const loadSuccess = (game) => ({ type: LOAD_SUCCESS, game })
const joinRequest = (username) => ({ type: JOIN_REQUEST, username })
const joinSuccess = (newMember) => ({ type: JOIN_SUCCESS, newMember })
const drawCardSuccess = (card) => ({ type: DRAW_CARD_SUCCESS, card })
const discardCardSuccess = (card) => ({ type: DISCARD_CARD_SUCCESS, card })
const error = (err) => ({ type: ERROR, error: err })

export const actions = {
  getGame,
  join,
  loadSuccess
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  game: null,
  membership: {},
  isWorking: false,
  error: null
}

const requestActionHandler = (state) => ({ ...state, isWorking: true, error: null })

const actionHandlers = {
  [LOAD_REQUEST]: requestActionHandler,

  [LOAD_SUCCESS]: (state, { game }) => {
    const nextState = deepmerge(state, { game, isWorking: false, error: null })

    return nextState
  },

  [JOIN_REQUEST]: requestActionHandler,

  [JOIN_SUCCESS]: (state, { newMember }) => {
    const nextState = deepmerge(state, { isWorking: false, error: null })

    const alreadyJoined = nextState.game.members.filter(member => member.id === newMember.id).length

    if (!alreadyJoined) {
      nextState.game.members.push(newMember)
    }

    nextState.membership[nextState.game.id] = newMember

    return nextState
  },

  [DRAW_CARD_SUCCESS]: (state, { card }) => {
    const nextState = deepmerge(state, { isWorking: false, error: null })

    nextState.game.availableCards = nextState.game.availableCards.filter(c => c !== card)

    nextState.game.discardedCards.push(card)

    return nextState
  },

  [DISCARD_CARD_SUCCESS]: (state, { card }) => {
    const nextState = deepmerge(state, { isWorking: false, error: null })

    nextState.game.discardedCards = nextState.game.discardedCards.filter(c => c !== card)

    nextState.game.availableCards.push(card)

    return nextState
  },

  [ERROR]: (state, { err }) => ({ ...state, isWorking: false, error: err })
}

export default function reducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
