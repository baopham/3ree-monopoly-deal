import GameService from '../services/GameService'
import PlayerService from '../services/PlayerService'
import GameHistoryService from '../services/GameHistoryService'

export default function setup (io) {
  GameService.liveUpdates(io)
  PlayerService.liveUpdates(io)
  GameHistoryService.liveUpdates(io)
}
