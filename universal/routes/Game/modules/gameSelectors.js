import { createSelector } from 'reselect'

const getCurrentGame = (state) => state.currentGame

export const getCurrentPlayer = createSelector(
  [getCurrentGame],
  (currentGame) => {
    return currentGame.game.members.find(member => member.username === currentGame.username)
  }
)

export const isPlayerTurn = createSelector(
  [getCurrentGame, getCurrentPlayer],
  (currentGame, currentPlayer) => {
    return currentPlayer &&
      currentGame.currentTurn &&
      currentGame.currentTurn === currentPlayer.username
  }
)
