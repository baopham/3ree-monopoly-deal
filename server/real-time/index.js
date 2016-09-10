import GameService from '../services/GameService'

export default function setup(io) {
  GameService.liveUpdates(io)
}
