/* @flow */
import { SAY_NO } from '../../../monopoly/cards'
import { createSelector } from 'reselect'
import type { CurrentGameState } from './currentGame'
import type { PaymentState } from './payment'
import type { CurrentPlayerCardsOnHandState } from './currentPlayerCardsOnHand'
import type { SayNoState } from './sayNo'

const getCurrentGame = (state) => state.currentGame
const getPayment = (state) => state.payment
const getCurrentPlayerCardsOnHand = (state) => state.currentPlayerCardsOnHand
const getSayNoState = (state) => state.sayNo

export const getCurrentPlayer = createSelector(
  [getCurrentGame],
  (currentGame: CurrentGameState): ?Player => {
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
  (currentGame: CurrentGameState, currentPlayer: Player): boolean => {
    return !!(
      currentPlayer &&
      currentGame.game &&
      currentGame.game.currentTurn &&
      currentGame.game.currentTurn === currentPlayer.username
    )
  }
)

export const getOtherPlayers = createSelector(
  [getCurrentGame, getCurrentPlayer],
  (currentGame: CurrentGameState, currentPlayer: Player): ?Player[] => {
    return currentPlayer &&
      currentGame.game &&
      currentGame.game.players.filter(player => player.id !== currentPlayer.id)
  }
)

export const isPayee = createSelector(
  [getCurrentPlayer, getPayment],
  (currentPlayer: Player, payment: PaymentState): boolean => {
    return !!(currentPlayer && payment.amount && payment.payee === currentPlayer.username)
  }
)

export const isPayer = createSelector(
  [getCurrentPlayer, getPayment],
  (currentPlayer: Player, payment: PaymentState): boolean => {
    return !!(currentPlayer && payment.payers && payment.payers.includes(currentPlayer.username))
  }
)

export const canSayNo = createSelector(
  [getCurrentPlayerCardsOnHand],
  (currentPlayerCardsOnHand: CurrentPlayerCardsOnHandState): boolean => {
    const { cardsOnHand } = currentPlayerCardsOnHand
    return cardsOnHand.includes(SAY_NO)
  }
)

export const canRespondToASayNo = createSelector(
  [canSayNo, getSayNoState, getCurrentPlayer],
  (canSayNo: boolean, sayNo: SayNoState, currentPlayer: Player): boolean => {
    return currentPlayer.username === sayNo.toUser && canSayNo
  }
)
