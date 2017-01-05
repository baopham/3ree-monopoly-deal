/* @flow */
import { combineReducers } from 'redux'
import cardRequestTypes from '../../../../monopoly/cardRequestTypes'
import slyDeal, { actions as slyDealActions } from './slyDeal'
import type { SlyDealState } from './slyDeal'

// ------------------------------------
// Action creators
// ------------------------------------
function subscribeCardRequestEvent (socket: Socket) {
  return (dispatch: Function, getState: Function) => {
    const gameId = getState().currentGame.game.id
    socket.on(`game-${gameId}-card-request-update`, onCardRequestUpdate.bind(this, dispatch))
  }
}

function unsubscribeCardRequestEvent (socket: Socket) {
  return (dispatch: Function, getState: Function) => {
    const gameId = getState().currentGame.game.id
    socket.off(`game-${gameId}-card-request-update`)
  }
}

function onCardRequestUpdate (dispatch: Function, cardRequest: CardRequest) {
  switch (cardRequest.type) {
    case cardRequestTypes.SLY_DEAL:
      dispatch(slyDealActions.updateSlyDealRequest(cardRequest.info))
      return

    default:
      throw new Error('Invalid card request type')
  }
}

export const actions = {
  subscribeCardRequestEvent,
  unsubscribeCardRequestEvent,
  onCardRequestUpdate
}

// ------------------------------------
// Reducer
// ------------------------------------
export type CardRequestState = {
  slyDeal: SlyDealState
}

export default combineReducers({
  slyDeal
})
