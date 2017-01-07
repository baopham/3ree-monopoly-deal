/* @flow */
import CardRequestRepository from '../../repositories/CardRequestRepository'
import PlayerRepository from '../../repositories/PlayerRepository'
import GameHistoryService from '../GameHistoryService'
import cardRequestTypes from '../../../universal/monopoly/cardRequestTypes'
import * as monopoly from '../../../universal/monopoly/monopoly'
import PropertySet from '../../../universal/monopoly/PropertySet'
import { SLY_DEAL } from '../../../universal/monopoly/cards'
import type { SlyDealInfo } from '../../../universal/monopoly/cardRequestTypes'
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
      .then(findPlayers.bind(this))
      .then(updatePlayersAndGameHistory.bind(this))
      .then(deleteRequest.bind(this))

    //////
    function findPlayers (cardRequest: CardRequest): Promise<[Player, Player]> {
      const { info }: { info: SlyDealInfo } = cardRequest

      promiseContext.cardRequest = cardRequest

      return Promise.all([
        this.playerRepository.findByGameIdAndUsername(cardRequest.gameId, info.fromUser),
        this.playerRepository.findByGameIdAndUsername(cardRequest.gameId, info.toUser)
      ])
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
        .findIndex(s => monopoly.unserializePropertySet(s).getId() === fromSetId)

      if (setToUpdateIndex === -1) {
        return Promise.reject(`Cannot find set ${fromSetId}`)
      }

      const setToUpdate = otherPlayer.placedCards.serializedPropertySets[setToUpdateIndex]
      const cardIndexToRemove = setToUpdate.cards.findIndex(c => c === cardToSlyDeal)
      setToUpdate.cards.splice(cardIndexToRemove, 1)

      if (!setToUpdate.cards.length) {
        otherPlayer.placedCards.serializedPropertySets.splice(setToUpdateIndex, 1)
      }

      return otherPlayer.save()
    }
  }
}
