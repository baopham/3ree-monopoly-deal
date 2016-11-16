import MemberRepository from '../repositories/MemberRepository'
import GameRepository from '../repositories/GameRepository'
import * as monopoly from '../../universal/monopoly/monopoly'

export default class MemberService {
  constructor () {
    this.memberRepository = new MemberRepository()
    this.gameRepository = new GameRepository()
  }

  static liveUpdates (io) {
    MemberRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-member-change`, change)
    })
  }

  placeCard (gameId, username, card, asMoney = false) {
    return this.memberRepository
      .findByGameIdAndUsername(gameId, username)
      .then(member => {
        const area = asMoney ? 'bank' : 'properties'
        member.placedCards[area].push(card)
        return this.memberRepository.update(member.id, member);
      })
  }

  playCard (gameId, username, card) {
    return this.discardCard(gameId, username, card)
  }

  discardCard (gameId, username, card) {
    return this.memberRepository
      .findByGameIdAndUsername(gameId, username)
      .then(member => {
        member.game.discardedCards.push(card)
        return this.gameRepository.update(gameId, member.game)
      })
  }

  giveCardToOtherMember (gameId, otherMemberUsername, card, asMoney = false) {
    const isMoneyCard = asMoney || monopoly.isMoneyCard(card)

    const otherMember = this.memberRepository.findByGameIdAndUsername(gameId, otherMemberUsername)

    const area = isMoneyCard ? 'bank' : 'properties'

    otherMember.placedCards[area].push(card)

    return this.memberRepository.update(otherMember.id, otherMember)
  }
}
