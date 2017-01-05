/* @flow */
import CardRequestRepository from '../../repositories/CardRequestRepository'
import cardRequestTypes from '../../../universal/monopoly/cardRequestTypes'
import type { SlyDealInfo } from '../../../universal/monopoly/cardRequestTypes'

export default class CardRequestService {
  cardRequestRepository: CardRequestRepository

  constructor () {
    this.cardRequestRepository = new CardRequestRepository()
  }

  static liveUpdates (io) {
    CardRequestRepository.watchForChanges((change) => {
      if (change.updated) {
        const cardRequest = change.new_val
        io.emit(`game-${cardRequest.gameId}-card-request-update`, cardRequest)
      }
    })
  }

  requestToSlyDeal (gameId: string, cardRequestInfo: SlyDealInfo): Promise<CardRequest> {
    return this.cardRequestRepository.insert({
      gameId,
      type: cardRequestTypes.SLY_DEAL,
      info: cardRequestInfo
    })
  }

  acceptSlyDeal (slyDealRequestId: string): Promise<CardRequest> {
    return this.cardRequestRepository.find(slyDealRequestId)
      .then((cardRequest: CardRequest) => {
        cardRequest.type = null
        cardRequest.info = null
        return cardRequest.save()
      })
  }
}
