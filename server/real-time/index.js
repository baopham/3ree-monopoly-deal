import GameService from '../services/GameService'
import MemberService from '../services/MemberService'

export default function setup (io) {
  GameService.liveUpdates(io)
  MemberService.liveUpdates(io)
}
