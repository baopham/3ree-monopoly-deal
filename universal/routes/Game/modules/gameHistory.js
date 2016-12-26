/* @flow */
import { namespace } from '../../../ducks-utils'

function ns (value) {
  return namespace('GAME_HISTORY', value)
}

// ------------------------------------
// Constants
// ------------------------------------
const RECORD = ns('RECORD')

// ------------------------------------
// Action
// ------------------------------------
function record (message: string) {
  return {
    type: RECORD,
    message
  }
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
  dispatch(record(newRecord.message))
}

export const actions = {
  subscribeGameHistoryEvent,
  unsubscribeGameHistoryEvent
}

// ------------------------------------
// Reducer
// ------------------------------------
export type GameHistoryState = string[]

const inititalState: GameHistoryState = []

export default function reducer (state: GameHistoryState = inititalState, action: ReduxAction) {
  switch (action.type) {
    case RECORD:
      return [...state, action.message]

    default:
      return state
  }
}
