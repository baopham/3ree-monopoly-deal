import { actions } from '../../universal/ducks/games'

// TODO: unsubscribe, resubscribe upon route change
export default function setupRealtimeGames (io, store) {
  io.on('game-change', (change) => {
    if (!change.old_val) {
      store.dispatch(actions.addSuccess({ game: change.new_val, count: change.count }))
    } else if (!change.new_val) {
      store.dispatch(actions.deleteSuccess({ game: change.old_val, count: change.count }))
    } else {
      store.dispatch(actions.updateSuccess({ game: change.new_val, count: change.count }))
    }
  })

  return io
}
