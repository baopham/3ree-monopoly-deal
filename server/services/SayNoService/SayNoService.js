/* @flow */
import SayNoRepository from '../../repositories/SayNoRepository'
import GameRepository from '../../repositories/GameRepository'
import PlayerService from '../../services/PlayerService'
import GameHistoryService from '../../services/GameHistoryService'
import CardRequestService from '../../services/CardRequestService'
import ModelNotFound from '../../errors/ModelNotFound'
import sayNoCauses from '../../../universal/monopoly/sayNoCauses'
import { SAY_NO } from '../../../universal/monopoly/cards'
import type { SayNoCause, SayNoCauseInfo } from '../../../universal/monopoly/sayNoCauses'

export default class SayNoService {
  sayNoRepository: SayNoRepository
  playerService: PlayerService
  gameHistoryService: GameHistoryService
  cardRequestService: CardRequestService
  gameRepository: GameRepository

  constructor () {
    this.sayNoRepository = new SayNoRepository()
    this.playerService = new PlayerService()
    this.gameHistoryService = new GameHistoryService()
    this.cardRequestService = new CardRequestService()
    this.gameRepository = new GameRepository()
  }

  static liveUpdates (io) {
    SayNoRepository.watchForChanges((change) => {
      io.emit(`game-${change.new_val.gameId}-say-no-update`, change)
    })
  }

  async sayNoToUser (
    gameId: string, fromUser: Username, toUser: Username, cause: SayNoCause, causeInfo: SayNoCauseInfo
  ): Promise<SayNo> {
    const logAction = () => this.gameHistoryService.record(
      gameId,
      `${cause}: ${fromUser} said NO to ${toUser}`,
      [toUser]
    )

    const discardCard = () => {
      return this.gameRepository.find(gameId)
        .then(game => {
          game.discardedCards.push(SAY_NO)
          return game.save()
        })
    }

    let sayNo

    try {
      sayNo = await this.sayNoRepository.findByGameId(gameId)

      sayNo.fromUser = fromUser
      sayNo.toUser = toUser
      sayNo.cause = cause
      sayNo.causeInfo = causeInfo

      await Promise.all([
        sayNo.save(),
        discardCard(),
        logAction()
      ])
    } catch (error) {
      if (error.name !== ModelNotFound.name) {
        throw error
      }

      sayNo = {
        fromUser,
        toUser,
        gameId,
        cause,
        causeInfo
      }

      await Promise.all([
        this.sayNoRepository.insert(sayNo),
        discardCard(),
        logAction()
      ])
    }

    return sayNo
  }

  async acceptSayNo (gameId: string, fromUser: Username, toUser: Username): Promise<*> {
    const sayNo = await this.sayNoRepository.findByGameId(gameId)

    if (sayNo.fromUser !== fromUser || sayNo.toUser !== toUser) {
      throw new Error('Cannot find the correct SayNo record')
    }

    await this.handleAcceptedSayNo(sayNo)

    const cause = sayNo.cause

    return Promise.all([
      sayNo.delete(),
      this.gameHistoryService.record(gameId, `${cause}: ${toUser} accepted NO from ${fromUser}`, [fromUser])
    ])
  }

  handleAcceptedSayNo (sayNo: SayNo): Promise<*> {
    if (!sayNo.causeInfo) {
      return Promise.reject(new Error('Empty causeInfo'))
    }

    switch (sayNo.cause) {
      case sayNoCauses.PAYMENT: {
        const { payer, payee } = sayNo.causeInfo

        const payeeAcceptedSayNo = payee === sayNo.toUser

        if (payeeAcceptedSayNo) {
          return this.playerService.removePayer(sayNo.gameId, payer, payee)
        }

        return Promise.resolve()
      }

      case sayNoCauses.SLY_DEAL: {
        const { slyDealRequestId } = sayNo.causeInfo

        return this.cardRequestService.getCardRequest(slyDealRequestId)
          .then((cardRequest: CardRequest) => {
            const cancelRequest = cardRequest.info.toUser === sayNo.fromUser
            return cancelRequest && cardRequest.delete()
          })
      }

      case sayNoCauses.FORCED_DEAL: {
        const { forcedDealRequestId } = sayNo.causeInfo

        return this.cardRequestService.getCardRequest(forcedDealRequestId)
          .then((cardRequest: CardRequest) => {
            const cancelRequest = cardRequest.info.toUser === sayNo.fromUser
            return cancelRequest && cardRequest.delete()
          })
      }

      case sayNoCauses.DEAL_BREAKER: {
        const { dealBreakerRequestId } = sayNo.causeInfo

        return this.cardRequestService.getCardRequest(dealBreakerRequestId)
          .then((cardRequest: CardRequest) => {
            const cancelRequest = cardRequest.info.toUser === sayNo.fromUser
            return cancelRequest && cardRequest.delete()
          })
      }

      default:
        return Promise.resolve()
    }
  }
}

