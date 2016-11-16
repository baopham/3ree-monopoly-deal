import { createSelector } from 'reselect'

const getCurrentGame = (state) => state.currentGame

export const getCurrentPlayer = createSelector(
  [getCurrentGame],
  (currentGame) => {
    const player = currentGame.game.members.find(member => member.username === currentGame.username)
    return player
  }
)

export const isPlayerTurn = createSelector(
  [getCurrentGame, getCurrentPlayer],
  (currentGame, currentPlayer) => {
    return currentGame.currentTurn === currentPlayer.username
  }
)
