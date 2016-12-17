/* @flow */
import { createSelector } from 'reselect'
import type { CurrentGameState } from './currentGame'
import type { PaymentState } from './payment'

const getCurrentGame = (state) => state.currentGame
const getPayment = (state) => state.payment

export const getCurrentPlayer = createSelector(
  [getCurrentGame],
  (currentGame: CurrentGameState) => {
    const game = currentGame.game

    if (!game) {
      return
    }

    const membership = currentGame.membership[game.id] || {}
    return game.players.find(player => player.id === membership.id)
  }
)

export const isPlayerTurn = createSelector(
  [getCurrentGame, getCurrentPlayer],
  (currentGame: CurrentGameState, currentPlayer: Player) => {
    return currentPlayer &&
      currentGame.game &&
      currentGame.game.currentTurn &&
      currentGame.game.currentTurn === currentPlayer.username
  }
)

export const getRequiredPayment = createSelector(
  [getCurrentGame, getCurrentGame, getPayment],
  (currentGame: CurrentGameState, currentPlayer: Player, payment: PaymentState) => {
    const needToPay = payment.amount && payment.payers && payment.payers.includes(currentPlayer.username)
    return needToPay ? payment : null
  }
)
