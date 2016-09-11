import { actions } from '../../universal/ducks/currentGame'

// TODO: unsubscribe, resubscribe upon route change
export default function setupRealtimeGame (io, store) {
  io.on('game-change', (change) => {
    const currentGame = store.getState().currentGame.game

    if (change.old_val && change.new_val && currentGame.id === change.new_val.id) {
      store.dispatch(actions.loadSuccess(change.new_val))
    }
  })

  return io
}
