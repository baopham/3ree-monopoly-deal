import socketClient from 'socket.io-client'
import games from './games'

const io = socketClient()

export default function setupRealtime(store) {
  games(io, store)
}
