/* @flow */
import { namespace } from '../../../ducks-utils'
import { getCurrentPlayer } from './gameSelectors'
import audioPlay from 'audio-play'
import audioLoad from 'audio-loader'

function ns (value) {
  return namespace('GAME_HISTORY', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const MAX_ITEMS = 20
const RECORD = ns('RECORD')
const RESET = ns('RESET')

// ------------------------------------
// Action creators
// ------------------------------------
function record (newRecord: GameHistoryRecord) {
  return {
    type: RECORD,
    newRecord
  }
}

function reset () {
  return { type: RESET }
}

function subscribeGameHistoryEvent (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.on(`game-${gameId}-history`, onGameHistoryEvent.bind(this, dispatch, getState))
  }
}

function unsubscribeGameHistoryEvent (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.off(`game-${gameId}-history`)
  }
}

function onGameHistoryEvent (dispatch: Function, getState: Function, newRecord: GameHistoryRecord) {
  if (newRecord.playersToNotify.length && newRecord.playersToNotify.includes(getCurrentPlayer(getState()).username)) {
    audioLoad('/notification.mp3').then(audioPlay)
  }

  dispatch(record(newRecord))
}

export const actions = {
  reset,
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
    case RECORD:
      return [action.newRecord, ...state.slice(0, MAX_ITEMS - 1)]

    case RESET:
      return inititalState

    default:
      return state
  }
}
