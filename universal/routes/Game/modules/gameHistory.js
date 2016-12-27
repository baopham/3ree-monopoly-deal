/* @flow */
import { namespace } from '../../../ducks-utils'

function ns (value) {
  return namespace('GAME_HISTORY', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const RECORD = ns('RECORD')
const RESET = ns('RESET')

// ------------------------------------
// Action
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

function unsubscribeGameHistoryEvent (socket: Socket) {
  return (dispatch: Function, getState: Function) => {
    socket.off(`game-${getState().currentGame.game.id}-history`)
  }
}

function onGameHistoryEvent (dispatch: Function, getState: Function, newRecord: GameHistoryRecord) {
  dispatch(record(newRecord))
}

export const actions = {
  resetGameHistory: reset,
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
      return [action.newRecord, ...state]

    case RESET:
      return inititalState

    default:
      return state
  }
}