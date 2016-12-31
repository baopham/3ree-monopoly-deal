/* @flow */
import { createSelector } from 'reselect'
import type { CurrentGameState } from './currentGame'

const getCurrentGame = (state) => state.currentGame

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
