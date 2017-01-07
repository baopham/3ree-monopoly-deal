/* @flow */
import { select, call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import * as request from '../../../request-util'
import { apiUrl } from '../../../ducks-utils'
import {
  LOAD_REQUEST,
  LOAD_SUCCESS,
  JOIN_REQUEST,
  JOIN_SUCCESS,
  END_TURN_REQUEST,
  END_TURN_SUCCESS,
  FLIP_PLACED_CARD_REQUEST,
  FLIP_PLACED_CARD_SUCCESS,
  FLIP_PLACED_LEFT_OVER_CARD_REQUEST,
  FLIP_PLACED_LEFT_OVER_CARD_SUCCESS,
  MOVE_PLACED_CARD_REQUEST,
  MOVE_PLACED_CARD_SUCCESS,
  MOVE_PLACED_LEFT_OVER_CARD_REQUEST,
  MOVE_PLACED_LEFT_OVER_CARD_SUCCESS,
  SET_WINNER_REQUEST,
  SET_WINNER_SUCCESS,
  ERROR
} from './currentGame'
import { getCurrentGameId, getCurrentPlayerUsername } from './gameSelectors'

const gamesUrl = `${apiUrl}/games`

// ------------------------------------
// Workers
// ------------------------------------
function* fetchGame ({ id }) {
  try {
    const response = yield call(request.get, `${gamesUrl}/${id}`)
    yield put({ type: LOAD_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* newPlayerJoin ({ username }) {
  try {
    const id = yield select(getCurrentGameId)
    const response = yield call(request.post, `${gamesUrl}/${id}/join`, { username })
    yield put({ type: JOIN_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* endTurn () {
  try {
    const id = yield select(getCurrentGameId)
    const response = yield call(request.put, `${gamesUrl}/${id}/end-turn`)
    yield put({ type: END_TURN_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* flipPlacedCard ({ card, propertySetId }) {
  try {
    const id = yield select(getCurrentGameId)
    const username = yield select(getCurrentPlayerUsername)
    const response = yield call(request.put, `${gamesUrl}/${id}/flip-card`, { card, username, propertySetId })
    yield put({ type: FLIP_PLACED_CARD_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* flipPlacedLeftOverCard ({ card }) {
  try {
    const id = yield select(getCurrentGameId)
    const username = yield select(getCurrentPlayerUsername)
    const response = yield call(request.put, `${gamesUrl}/${id}/flip-left-over-card`, { card, username })
    yield put({ type: FLIP_PLACED_LEFT_OVER_CARD_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* movePlacedCard ({ card, fromSetId, toSetId }) {
  try {
    const id = yield select(getCurrentGameId)
    const username = yield select(getCurrentPlayerUsername)
    const response = yield call(request.put, `${gamesUrl}/${id}/move-card`, { card, username, fromSetId, toSetId })
    yield put({ type: MOVE_PLACED_CARD_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* movePlacedLeftOverCard ({ card, toSetId }) {
  try {
    const id = yield select(getCurrentGameId)
    const username = yield select(getCurrentPlayerUsername)
    const response = yield call(request.put, `${gamesUrl}/${id}/move-left-over-card`, { card, username, toSetId })
    yield put({ type: MOVE_PLACED_LEFT_OVER_CARD_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

function* setWinner ({ winner }) {
  try {
    const id = yield select(getCurrentGameId)
    const response = yield call(request.put, `${gamesUrl}/${id}/winner`, { winner })
    yield put({ type: SET_WINNER_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: ERROR, error })
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* watchers () {
  yield [
    fork(() => takeLatest(LOAD_REQUEST, fetchGame)),
    fork(() => takeEvery(JOIN_REQUEST, newPlayerJoin)),
    fork(() => takeEvery(END_TURN_REQUEST, endTurn)),
    fork(() => takeEvery(FLIP_PLACED_CARD_REQUEST, flipPlacedCard)),
    fork(() => takeEvery(FLIP_PLACED_LEFT_OVER_CARD_REQUEST, flipPlacedLeftOverCard)),
    fork(() => takeEvery(MOVE_PLACED_CARD_REQUEST, movePlacedCard)),
    fork(() => takeEvery(MOVE_PLACED_LEFT_OVER_CARD_REQUEST, movePlacedLeftOverCard)),
    fork(() => takeEvery(SET_WINNER_REQUEST, setWinner))
  ]
}
