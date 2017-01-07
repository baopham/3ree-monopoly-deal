import GameService from '../services/GameService'
import PlayerService from '../services/PlayerService'
import GameHistoryService from '../services/GameHistoryService'
import SayNoService from '../services/SayNoService'
import CardRequestService from '../services/CardRequestService'

export default function setup (io) {
  GameService.liveUpdates(io)
  PlayerService.liveUpdates(io)
  GameHistoryService.liveUpdates(io)
  SayNoService.liveUpdates(io)
  CardRequestService.liveUpdates(io)
}
