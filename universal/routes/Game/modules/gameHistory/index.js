/* @flow */
import _ from 'lodash'
import request from 'axios'
import { namespace, apiUrl } from '../../../../ducks-utils'
import { getCurrentPlayer } from '../gameSelectors'
import audioPlay from 'audio-play'
import audioLoad from 'audio-loader'

function ns (value) {
  return namespace('GAME_HISTORY', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const gamesUrl = `${apiUrl}/games`
const throttledPlaySound = _.throttle(playSound, 1000)

const MAX_ITEMS = 20
const LOAD_REQUEST = ns('LOAD_REQUEST')
const LOAD_SUCCESS = ns('LOAD_SUCCESS')
const RECORD = ns('RECORD')
const RESET = ns('RESET')
const ERROR = ns('ERROR')

// ------------------------------------
// Action creators
// ------------------------------------
function getRecentHistoryLogs () {
  return {
    types: [LOAD_REQUEST, LOAD_SUCCESS, ERROR],
    promise: (dispatch: Function, getState: Function) => {
      const game = getState().currentGame.game
      return request.get(`${gamesUrl}/${game.id}/history`)
    }
  }
}

function record (newRecord: GameHistoryRecord) {
  return {
    type: RECORD,
    newRecord
  }
}

function reset () {
  return { type: RESET }
}

function subscribeGameHistoryEvent (gameId: string) {
  return (dispatch: Function, getState: Function) => {
    global.socket.on(`game-${gameId}-history`, onGameHistoryEvent.bind(this, dispatch, getState))
  }
}

function unsubscribeGameHistoryEvent (gameId: string) {
  return (dispatch: Function, getState: Function) => {
    global.socket.off(`game-${gameId}-history`)
  }
}

function onGameHistoryEvent (dispatch: Function, getState: Function, newRecord: GameHistoryRecord) {
  const currentPlayer = getCurrentPlayer(getState())

  if (!currentPlayer) {
    throw new Error('Cannot find current player')
  }

  if (newRecord.playersToNotify.length && newRecord.playersToNotify.includes(currentPlayer.username)) {
    throttledPlaySound()
  }

  dispatch(record(newRecord))
}

function playSound () {
  audioLoad('/notification.mp3').then(audioPlay)
}

export const actions = {
  reset,
  getRecentHistoryLogs,
  subscribeGameHistoryEvent,
  unsubscribeGameHistoryEvent
}

// ------------------------------------
// Reducer
// ------------------------------------
export type GameHistoryState = GameHistoryRecord[]

const inititalState: GameHistoryState = []

export default function reducer (state: GameHistoryState = inititalState, action: ReduxAction): GameHistoryState {
  switch (action.type) {
    case LOAD_SUCCESS:
      return action.payload.logs

    case RECORD:
      return [action.newRecord, ...state.slice(0, MAX_ITEMS - 1)]

    case RESET:
      return inititalState

    default:
      return state
  }
}
