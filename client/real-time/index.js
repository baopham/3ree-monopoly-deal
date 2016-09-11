import socketClient from 'socket.io-client'
import games from './games'
import currentGame from './currentGame'

const io = socketClient()

export default function setupRealtime (store) {
  games(io, store)
  currentGame(io, store)
}
