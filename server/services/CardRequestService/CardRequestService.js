/* @flow */
import CardRequestRepository from '../../repositories/CardRequestRepository'
import PlayerRepository from '../../repositories/PlayerRepository'
import GameHistoryService from '../GameHistoryService'
import cardRequestTypes from '../../../universal/monopoly/cardRequestTypes'
import * as monopoly from '../../../universal/monopoly/monopoly'
import PropertySet from '../../../universal/monopoly/PropertySet'
import { SLY_DEAL, FORCED_DEAL } from '../../../universal/monopoly/cards'
import * as sideEffectUtils from '../../side-effect-utils'
import type { SlyDealInfo, ForcedDealInfo } from '../../../universal/monopoly/cardRequestTypes'
import type { PropertySetId } from '../../../universal/monopoly/PropertySet'

export default class CardRequestService {
  cardRequestRepository: CardRequestRepository
  gameHistoryService: GameHistoryService
  playerRepository: PlayerRepository

  constructor () {
    this.cardRequestRepository = new CardRequestRepository()
    this.gameHistoryService = new GameHistoryService()
    this.playerRepository = new PlayerRepository()
  }

  static liveUpdates (io) {
    CardRequestRepository.watchForChanges((change) => {
      const cardRequest = change.new_val || change.old_val
      io.emit(`game-${cardRequest.gameId}-card-request-update`, change)
    })
  }

  getCardRequest (id: string): Promise<CardRequest> {
    return this.cardRequestRepository.find(id)
  }

  cancelRequest (id: string): Promise<*> {
    return this.cardRequestRepository.find(id)
      .then((cardRequest: CardRequest) => cardRequest.delete())
  }

  requestToSlyDeal (gameId: string, cardRequestInfo: SlyDealInfo): Promise<[CardRequest, GameHistoryRecord]> {
    const { fromUser, toUser, card } = cardRequestInfo

    return Promise.all([
      this.cardRequestRepository.insert({ gameId, type: cardRequestTypes.SLY_DEAL, info: cardRequestInfo }),
      this.gameHistoryService.record(gameId, `${fromUser} wants to sly deal ${card} from ${toUser}`)
    ])
  }

  acceptSlyDeal (slyDealRequestId: string): Promise<CardRequest> {
    const promiseContext: { cardRequest: ?CardRequest } = {
      cardRequest: null
    }

    return this.cardRequestRepository
      .find(slyDealRequestId)
      .theh(cacheCardRequest)
      .then(this.findPlayers)
      .then(updatePlayersAndGameHistory.bind(this))
      .then(deleteRequest.bind(this))

    //////
    function cacheCardRequest (cardRequest: CardRequest): CardRequest {
      promiseContext.cardRequest = cardRequest
      return cardRequest
    }

    function updatePlayersAndGameHistory ([fromPlayer: Player, toPlayer: Player]): Promise<*> {
      const { cardRequest } = promiseContext

      if (!cardRequest) {
        return Promise.reject('Card request record could not be found')
      }

      const logActionAndNotifyPlayer = () => {
        const { gameId, info: { fromUser, toUser, card } } = cardRequest
        return this.gameHistoryService.record(
          gameId,
          `${fromUser} sly dealt ${card} from ${toUser}`,
          [toUser]
        )
      }

      return Promise.all([
        updateThisPlayer(fromPlayer, cardRequest.info.card),
        updateOtherPlayer(toPlayer, cardRequest.info.card, cardRequest.info.setId),
        logActionAndNotifyPlayer()
      ])
    }

    function deleteRequest () {
      promiseContext.cardRequest && promiseContext.cardRequest.delete()
    }

    function updateThisPlayer (thisPlayer: Player, cardToSlyDeal: CardKey): Promise<*> {
      const hasBeenPlaced = monopoly.putInTheFirstNonFullSet(
        cardToSlyDeal,
        thisPlayer.placedCards.serializedPropertySets
      )

      if (!hasBeenPlaced && monopoly.canBePutIntoANewSet(cardToSlyDeal)) {
        const newSet = new PropertySet(monopoly.getPropertySetIdentifier(cardToSlyDeal), [cardToSlyDeal])
        thisPlayer.placedCards.serializedPropertySets.push(newSet.serialize())
      }

      if (!hasBeenPlaced && !monopoly.canBePutIntoANewSet(cardToSlyDeal)) {
        thisPlayer.placedCards.leftOverCards.push(cardToSlyDeal)
      }

      thisPlayer.game.lastCardPlayedBy = thisPlayer.username
      thisPlayer.game.discardedCards.push(SLY_DEAL)
      thisPlayer.actionCounter += 1

      return thisPlayer.saveAll()
    }

    function updateOtherPlayer (otherPlayer: Player, cardToSlyDeal: CardKey, fromSetId: PropertySetId): Promise<*> {
      const setToUpdateIndex = otherPlayer.placedCards.serializedPropertySets
        .findIndex(s => PropertySet.unserialize(s).getId() === fromSetId)

      if (setToUpdateIndex === -1) {
        return Promise.reject(`Cannot find set ${fromSetId}`)
      }

      const setToUpdate = otherPlayer.placedCards.serializedPropertySets[setToUpdateIndex]
      sideEffectUtils.removeCardFromSet(cardToSlyDeal, setToUpdate)

      if (!setToUpdate.cards.length) {
        otherPlayer.placedCards.serializedPropertySets.splice(setToUpdateIndex, 1)
      }

      return otherPlayer.save()
    }
  }

  requestToForceDeal (gameId: string, cardRequestInfo: ForcedDealInfo): Promise<[CardRequest, GameHistoryRecord]> {
    const { fromUser, toUser, fromUserCard, toUserCard } = cardRequestInfo

    return Promise.all([
      this.cardRequestRepository.insert({ gameId, type: cardRequestTypes.FORCED_DEAL, info: cardRequestInfo }),
      this.gameHistoryService.record(
        gameId,
        `${fromUser} wants to swap ${fromUserCard} with ${toUserCard} from ${toUser}`
      )
    ])
  }

  acceptForcedDeal (forcedDealRequestId: string): Promise<*> {
    const promiseContext: { cardRequest: ?CardRequest } = {
      cardRequest: null
    }

    return this.cardRequestRepository
      .find(forcedDealRequestId)
      .then(cacheCardRequest)
      .then(this.findPlayers)
      .then(updatePlayersAndGameHistory.bind(this))
      .then(deleteRequest.bind(this))

    //////
    function cacheCardRequest (cardRequest: CardRequest): CardRequest {
      promiseContext.cardRequest = cardRequest
      return cardRequest
    }

    function updatePlayersAndGameHistory ([fromPlayer: Player, toPlayer: Player]): Promise<*> {
      const { cardRequest } = promiseContext

      if (!cardRequest) {
        return Promise.reject('Card request record could not be found')
      }

      const logActionAndNotifyPlayer = () => {
        const { gameId, info: { fromUser, toUser, fromUserCard, toUserCard } } = cardRequest
        return this.gameHistoryService.record(
          gameId,
          `${fromUser} swapped ${fromUserCard} with ${toUserCard} from ${toUser}`,
          [toUser]
        )
      }

      return Promise.all([
        updateThisPlayer(fromPlayer, cardRequest.info),
        updateOtherPlayer(toPlayer, cardRequest.info),
        logActionAndNotifyPlayer()
      ])
    }

    function deleteRequest () {
      promiseContext.cardRequest && promiseContext.cardRequest.delete()
    }

    function updateThisPlayer (thisPlayer: Player, info: ForcedDealInfo): Promise<*> {
      const { fromUserCard, fromUserSetId, toUserCard: forcedDealCard } = info

      sideEffectUtils.removeCardFromSetBySetId(
        fromUserCard,
        fromUserSetId,
        thisPlayer.placedCards.serializedPropertySets
      )

      const hasBeenPlaced = monopoly.putInTheFirstNonFullSet(
        forcedDealCard,
        thisPlayer.placedCards.serializedPropertySets
      )

      if (!hasBeenPlaced && monopoly.canBePutIntoANewSet(forcedDealCard)) {
        const newSet = new PropertySet(monopoly.getPropertySetIdentifier(forcedDealCard), [forcedDealCard])
        thisPlayer.placedCards.serializedPropertySets.push(newSet.serialize())
      }

      if (!hasBeenPlaced && !monopoly.canBePutIntoANewSet(forcedDealCard)) {
        thisPlayer.placedCards.leftOverCards.push(forcedDealCard)
      }

      thisPlayer.game.lastCardPlayedBy = thisPlayer.username
      thisPlayer.game.discardedCards.push(FORCED_DEAL)
      thisPlayer.actionCounter += 1

      return thisPlayer.saveAll()
    }

    function updateOtherPlayer (otherPlayer: Player, info: ForcedDealInfo): Promise<*> {
      const { fromUserCard, toUserSetId, toUserCard } = info

      sideEffectUtils.removeCardFromSetBySetId(toUserCard, toUserSetId, otherPlayer.placedCards.serializedPropertySets)

      const hasBeenPlaced = monopoly.putInTheFirstNonFullSet(
        fromUserCard,
        otherPlayer.placedCards.serializedPropertySets
      )

      if (!hasBeenPlaced && monopoly.canBePutIntoANewSet(fromUserCard)) {
        const newSet = new PropertySet(monopoly.getPropertySetIdentifier(fromUserCard), [fromUserCard])
        otherPlayer.placedCards.serializedPropertySets.push(newSet.serialize())
      }

      if (!hasBeenPlaced && !monopoly.canBePutIntoANewSet(fromUserCard)) {
        otherPlayer.placedCards.leftOverCards.push(fromUserCard)
      }

      return otherPlayer.save()
    }
  }

  findPlayers (cardRequest: CardRequest): Promise<[Player, Player]> {
    const { info }: { info: ForcedDealInfo } = cardRequest

    return Promise.all([
      this.playerRepository.findByGameIdAndUsername(cardRequest.gameId, info.fromUser),
      this.playerRepository.findByGameIdAndUsername(cardRequest.gameId, info.toUser)
    ])
  }
}
