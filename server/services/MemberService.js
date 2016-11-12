import MemberRepository from '../repositories/MemberRepository'
import { * as monopoly } from '../../universal/monopoly/monopoly'

export default class MemberService {
  constructor (gameId) {
    this.memberRepository = new MemberRepository()
    this.gameId = gameId
  }

  static liveUpdates (io) {
    MemberRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-member-change`, change)
    })
  }

  placeCard (card, asMoney = false) {

  }

  discardCard (card) {

  }

  sayNo () {

  }

  playCard (card) {

  }

  giveCardToOtherMember (otherMemberUsername, card, asMoney = false) {
    const isMoneyCard = asMoney || monopoly.isMoneyCard(card)

    const otherMember = this.memberRepository.findByGameIdAndUsername(this.gameId, otherMemberUsername)

    const area = isMoneyCard ? 'bank' : 'properties'

    otherMember.placedCards[area].push(card)

    this.memberRepository.update(otherMember.id, otherMember)

  }
}
