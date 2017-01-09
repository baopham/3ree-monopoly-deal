/* @flow */
import { combineReducers } from 'redux'
import cardRequestTypes from '../../../../monopoly/cardRequestTypes'
import slyDeal, { actions as slyDealActions } from './slyDeal'
import forcedDeal, { actions as forcedDealActions } from './forcedDeal'
import type { SlyDealState } from './slyDeal'
import type { ForcedDealState } from './forcedDeal'

// ------------------------------------
// Action creators
// ------------------------------------
function subscribeCardRequestEvent (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.on(`game-${gameId}-card-request-update`, onCardRequestUpdate.bind(this, dispatch))
  }
}

function unsubscribeCardRequestEvent (socket: Socket, gameId: string) {
  return (dispatch: Function, getState: Function) => {
    socket.off(`game-${gameId}-card-request-update`)
  }
}

function onCardRequestUpdate (dispatch: Function, change: Object) {
  const cardRequest = change.new_val || change.old_val

  switch (cardRequest.type) {
    case cardRequestTypes.SLY_DEAL:
      dispatch(slyDealActions.onSlyDealUpdateEvent(change))
      return

    case cardRequestTypes.FORCED_DEAL:
      dispatch(forcedDealActions.onForcedDealUpdateEvent(change))
      return

    default:
      throw new Error('Invalid card request type')
  }
}

function reset () {
  return (dispatch: Function, getState: Function) => {
    dispatch(slyDealActions.reset())
    dispatch(forcedDealActions.reset())
  }
}

export const actions = {
  subscribeCardRequestEvent,
  unsubscribeCardRequestEvent,
  reset,
  ...slyDealActions,
  ...forcedDealActions
}

// ------------------------------------
// Reducer
// ------------------------------------
export type CardRequestState = {
  slyDeal: SlyDealState,
  forcedDeal: ForcedDealState
}

export default combineReducers({
  slyDeal,
  forcedDeal
})
