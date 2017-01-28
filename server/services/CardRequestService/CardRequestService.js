/* @flow */
import CardRequestRepository from '../../repositories/CardRequestRepository'
import PlayerRepository from '../../repositories/PlayerRepository'
import GameHistoryService from '../GameHistoryService'
import cardRequestTypes, { SetCardType, LeftOverCardType } from '../../../universal/monopoly/cardRequestTypes'
import * as monopoly from '../../../universal/monopoly/monopoly'
import PropertySet from '../../../universal/monopoly/PropertySet'
import { SLY_DEAL, FORCED_DEAL } from '../../../universal/monopoly/cards'
import * as sideEffectUtils from '../../side-effect-utils'
import * as propertySetUtils from '../../property-set-utils'
import { markCard, markSet } from '../../../universal/monopoly/logMessageParser'
import type { SlyDealInfo, ForcedDealInfo, DealBreakerInfo } from '../../../universal/monopoly/cardRequestTypes'

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

  requestToSlyDeal (gameId: string, cardRequestInfo: SlyDealInfo): Promise<[CardRequest, GameHistoryRecord]> {
    const { fromUser, toUser, card } = cardRequestInfo

    return Promise.all([
      this.cardRequestRepository.insert({ gameId, type: cardRequestTypes.SLY_DEAL, info: cardRequestInfo }),
      this.gameHistoryService.record(gameId, `${fromUser} wants to sly deal ${markCard(card)} from ${toUser}`)
    ])
  }

  async acceptSlyDeal (slyDealRequestId: string): Promise<CardRequest> {
    const cardRequest: CardRequest = await this.cardRequestRepository.find(slyDealRequestId)

    const [fromPlayer, toPlayer] = await this.findPlayers(cardRequest)

    const { gameId, info: { fromUser, toUser, card } } = cardRequest

    await Promise.all([
      updatePlayers(fromPlayer, toPlayer),
      this.gameHistoryService.record(gameId, `${fromUser} sly dealt ${markCard(card)} from ${toUser}`, [toUser])
    ])

    return cardRequest.delete()

    //////
    function updatePlayers (fromPlayer: Player, toPlayer: Player): Promise<*> {
      if (!cardRequest) {
        return Promise.reject('Card request record could not be found')
      }

      return Promise.all([
        updateThisPlayer(fromPlayer, cardRequest.info.card),
        updateOtherPlayer(toPlayer, cardRequest.info)
      ])
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

    function updateOtherPlayer (otherPlayer: Player, slyDealInfo: SlyDealInfo): Promise<*> {
      if (slyDealInfo.cardType === LeftOverCardType) {
        sideEffectUtils.removeFirstInstanceFromArray(slyDealInfo.card, otherPlayer.placedCards.leftOverCards)
        return otherPlayer.save()
      }

      const { setId: fromSetId, card: cardToSlyDeal } = slyDealInfo

      if (slyDealInfo.cardType !== SetCardType || !fromSetId) {
        return Promise.reject(`Invalid sly deal info ${JSON.stringify(slyDealInfo)}`)
      }

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
        `${fromUser} wants to swap ${markCard(fromUserCard)} with ${markCard(toUserCard)} from ${toUser}`
      )
    ])
  }

  async acceptForcedDeal (forcedDealRequestId: string): Promise<*> {
    const cardRequest: CardRequest = await this.cardRequestRepository.find(forcedDealRequestId)

    const [fromPlayer, toPlayer] = await this.findPlayers(cardRequest)

    const { gameId, info: { fromUser, toUser, fromUserCard, toUserCard } } = cardRequest

    await Promise.all([
      updatePlayers(fromPlayer, toPlayer),
      this.gameHistoryService.record(
        gameId,
        `${fromUser} swapped ${markCard(fromUserCard)} with ${markCard(toUserCard)} from ${toUser}`,
        [toUser]
      )
    ])

    return cardRequest.delete()

    //////
    function updatePlayers (fromPlayer: Player, toPlayer: Player): Promise<*> {
      if (!cardRequest) {
        return Promise.reject('Card request record could not be found')
      }

      return Promise.all([
        updateThisPlayer(fromPlayer, cardRequest.info),
        updateOtherPlayer(toPlayer, cardRequest.info)
      ])
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

      thisPlayer.placedCards = propertySetUtils.cleanUpPlacedCards(thisPlayer.placedCards)
      thisPlayer.game.lastCardPlayedBy = thisPlayer.username
      thisPlayer.game.discardedCards.push(FORCED_DEAL)
      thisPlayer.actionCounter += 1

      return thisPlayer.saveAll()
    }

    function updateOtherPlayer (otherPlayer: Player, info: ForcedDealInfo): Promise<*> {
      const { cardType, fromUserCard, toUserSetId, toUserCard } = info

      if (cardType === LeftOverCardType) {
        sideEffectUtils.removeFirstInstanceFromArray(info.toUserCard, otherPlayer.placedCards.leftOverCards)
      } else if (cardType === SetCardType && toUserSetId) {
        sideEffectUtils.removeCardFromSetBySetId(
          toUserCard,
          toUserSetId,
          otherPlayer.placedCards.serializedPropertySets
        )
      }

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

      otherPlayer.placedCards = propertySetUtils.cleanUpPlacedCards(otherPlayer.placedCards)

      return otherPlayer.save()
    }
  }

  requestToDealBreak (gameId: string, cardRequestInfo: DealBreakerInfo): Promise<[CardRequest, GameHistoryRecord]> {
    const { fromUser, toUser } = cardRequestInfo

    return Promise.all([
      this.cardRequestRepository.insert({ gameId, type: cardRequestTypes.DEAL_BREAKER, info: cardRequestInfo }),
      this.gameHistoryService.record(
        gameId,
        `${fromUser} wants to deal break ${markSet(cardRequestInfo.setId)} from ${toUser}`
      )
    ])
  }

  async acceptDealBreaker (dealBreakerRequestId: string): Promise<*> {
    const cardRequest = await this.cardRequestRepository.find(dealBreakerRequestId)

    const { gameId, info: { fromUser, toUser, setId } } = cardRequest

    const [fromPlayer: Player, toPlayer: Player] = await Promise.all([
      this.playerRepository.findByGameIdAndUsername(gameId, fromUser),
      this.playerRepository.findByGameIdAndUsername(gameId, toUser)
    ])

    const setIndexToDealBreak: number = propertySetUtils.getSetIndexBySetId(
      setId,
      toPlayer.placedCards.serializedPropertySets
    )

    if (setIndexToDealBreak < 0) {
      throw new Error('Could not find the set to deal break')
    }

    const setToDealBreak = toPlayer.placedCards.serializedPropertySets[setIndexToDealBreak]

    sideEffectUtils.removeSetFromPlacedCardsBySetIndex(setIndexToDealBreak, toPlayer.placedCards)
    sideEffectUtils.addSetToPlacedCards(setToDealBreak, fromPlayer.placedCards)

    fromPlayer.actionCounter += 1

    await Promise.all([
      fromPlayer.save(),
      toPlayer.save(),
      this.gameHistoryService.record(gameId, `${toUser} accepted the deal breaker request from ${fromUser}`, [fromUser])
    ])

    return cardRequest.delete()
  }

  findPlayers (cardRequest: CardRequest): Promise<[Player, Player]> {
    const { info }: { info: ForcedDealInfo } = cardRequest

    return Promise.all([
      this.playerRepository.findByGameIdAndUsername(cardRequest.gameId, info.fromUser),
      this.playerRepository.findByGameIdAndUsername(cardRequest.gameId, info.toUser)
    ])
  }
}
