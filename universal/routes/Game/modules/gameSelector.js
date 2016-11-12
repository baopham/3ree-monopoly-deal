import { createSelector } from 'reselect'

const getCurrentGame = (state) => state.currentGame

export const getCurrentPlayer = createSelector(
  [getCurrentGame],
  ({ game, membership }) => {
    const player = game && membership[game.id]
    return player
  }
)
