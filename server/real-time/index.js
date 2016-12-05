import GameService from '../services/GameService'
import PlayerService from '../services/PlayerService'

export default function setup (io) {
  GameService.liveUpdates(io)
  PlayerService.liveUpdates(io)
}

