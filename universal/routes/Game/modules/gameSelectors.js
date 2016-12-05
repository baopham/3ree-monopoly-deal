import { createSelector } from 'reselect'

const getCurrentGame = (state) => state.currentGame

export const getCurrentPlayer = createSelector(
  [getCurrentGame],
  (currentGame) => {
    const membership = currentGame.membership[currentGame.game.id] || {}
    return currentGame.game.players.find(player => player.id === membership.id)
  }
)

export const isPlayerTurn = createSelector(
  [getCurrentGame, getCurrentPlayer],
  (currentGame, currentPlayer) => {
    return currentPlayer &&
      currentGame.game.currentTurn &&
      currentGame.game.currentTurn === currentPlayer.username
  }
)
