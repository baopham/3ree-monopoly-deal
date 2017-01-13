/* @flow */
import SayNoRepository from '../../repositories/SayNoRepository'
import PlayerService from '../../services/PlayerService'
import GameHistoryService from '../../services/GameHistoryService'
import CardRequestService from '../../services/CardRequestService'
import ModelNotFound from '../../errors/ModelNotFound'
import sayNoCauses from '../../../universal/monopoly/sayNoCauses'
import type { SayNoCause, SayNoCauseInfo } from '../../../universal/monopoly/sayNoCauses'

export default class SayNoService {
  sayNoRepository: SayNoRepository
  playerService: PlayerService
  gameHistoryService: GameHistoryService
  cardRequestService: CardRequestService

  constructor () {
    this.sayNoRepository = new SayNoRepository()
    this.playerService = new PlayerService()
    this.gameHistoryService = new GameHistoryService()
    this.cardRequestService = new CardRequestService()
  }

  static liveUpdates (io) {
    SayNoRepository.watchForChanges((change) => {
      if (change.updated || change.created) {
        io.emit(`game-${change.new_val.gameId}-say-no-update`, change.new_val)
      }
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

    let sayNo

    try {
      sayNo = await this.sayNoRepository.findByGameId(gameId)

      sayNo.fromUser = fromUser
      sayNo.toUser = toUser
      sayNo.cause = cause
      sayNo.causeInfo = causeInfo

      await Promise.all([
        sayNo.save(),
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
        logAction()
      ])
    }

    return sayNo
  }

  acceptSayNo (gameId: string, fromUser: Username, toUser: Username): Promise<*> {
    const promiseContext = {}

    return this.sayNoRepository.findByGameId(gameId)
      .then(sayNo => {
        if (sayNo.fromUser !== fromUser || sayNo.toUser !== toUser) {
          return Promise.reject('Cannot find the correct SayNo record')
        }

        promiseContext.sayNo = sayNo

        return this.handleAcceptedSayNo(sayNo)
      })
      .then(() => {
        const { sayNo } = promiseContext
        const cause = sayNo.cause

        sayNo.fromUser = null
        sayNo.toUser = null
        sayNo.cause = null
        sayNo.causeInfo = null

        return Promise.all([
          sayNo.save(),
          this.gameHistoryService.record(gameId, `${cause}: ${toUser} accepted NO from ${fromUser}`, [fromUser])
        ])
      })
  }

  handleAcceptedSayNo (sayNo: SayNo): Promise<*> {
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
            return cancelRequest && this.cardRequestService.cancelRequest(slyDealRequestId)
          })
      }

      default:
        return Promise.resolve()
    }
  }
}

