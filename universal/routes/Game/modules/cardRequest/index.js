/* @flow */
import { combineReducers } from 'redux'
import request from 'axios'
import { apiUrl } from '../../../../ducks-utils'
import cardRequestTypes from '../../../../monopoly/cardRequestTypes'
import slyDeal, { actions as slyDealActions } from './slyDeal'
import forcedDeal, { actions as forcedDealActions } from './forcedDeal'
import dealBreaker, { actions as dealBreakerActions } from './dealBreaker'
import type { SlyDealState } from './slyDeal'
import type { ForcedDealState } from './forcedDeal'
import type { DealBreakerState } from './dealBreaker'

// ------------------------------------
// Action creators
// ------------------------------------
function getCurrentCardRequest (gameId: string) {
  return (dispatch: Function, getState: Function) => {
    const game = getState().currentGame.game
    request.get(`${apiUrl}/games/${game.id}/card-request`)
      .then(res => {
        const { cardRequest } = res.data

        if (!cardRequest) {
          return
        }

        const cardRequestUpdate = {
          new_val: cardRequest
        }

        onCardRequestUpdate(dispatch, cardRequestUpdate)
      })
  }
}

function subscribeCardRequestEvent (gameId: string) {
  return (dispatch: Function, getState: Function) => {
    global.socket.on(`game-${gameId}-card-request-update`, onCardRequestUpdate.bind(this, dispatch))
  }
}

function unsubscribeCardRequestEvent (gameId: string) {
  return (dispatch: Function, getState: Function) => {
    global.socket.off(`game-${gameId}-card-request-update`)
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

    case cardRequestTypes.DEAL_BREAKER:
      dispatch(dealBreakerActions.onDealBreakerUpdateEvent(change))
      return

    default:
      throw new Error('Invalid card request type')
  }
}

function reset () {
  return (dispatch: Function, getState: Function) => {
    dispatch(slyDealActions.reset())
    dispatch(forcedDealActions.reset())
    dispatch(dealBreakerActions.reset())
  }
}

export const actions = {
  getCurrentCardRequest,
  subscribeCardRequestEvent,
  unsubscribeCardRequestEvent,
  reset,
  ...slyDealActions,
  ...forcedDealActions,
  ...dealBreakerActions
}

// ------------------------------------
// Reducer
// ------------------------------------
export type CardRequestState = {
  slyDeal: SlyDealState,
  forcedDeal: ForcedDealState,
  dealBreaker: DealBreakerState
}

export default combineReducers({
  slyDeal,
  forcedDeal,
  dealBreaker
})
