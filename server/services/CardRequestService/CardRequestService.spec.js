/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import td from 'testdouble'
import * as testUtils from '../../test-utils'
import {
  PROPERTY_BLUE
} from '../../../universal/monopoly/cards'
import { getCardObject } from '../../../universal/monopoly/monopoly'
import PropertySet from '../../../universal/monopoly/PropertySet'
import cardRequestTypes from '../../../universal/monopoly/cardRequestTypes'

describe('CardRequestService', function () {
  let cardRequestService

  describe('#acceptSlyDeal', function () {
    let fakeGame
    let fakeFromPlayer
    let fakeToPlayer
    let cardRequestRepository
    let playerRepository
    let gameHistoryService
    let fakeCardRequest

    const gameId = 'game-id'
    const propertySetStub = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE])
    const [expectedCardToSlyDeal] = propertySetStub.getCards()

    afterEach(function () {
      td.reset()
    })

    beforeEach(function () {
      setupGameAndPlayers()
      setupCardRequest()
      setupCardRequestRepository()
      setupPlayerRepository()
      setupGameHistoryService()

      const CardRequestService = require('./CardRequestService').default

      cardRequestService = new CardRequestService()

      //////
      function setupGameAndPlayers () {
        fakeFromPlayer = testUtils.fakePlayer({
          id: 'foo-bar',
          gameId
        })

        fakeToPlayer = testUtils.fakePlayer({
          id: 'foo-bar-2',
          gameId,
          placedCards: {
            bank: [],
            leftOverCards: [],
            serializedPropertySets: [propertySetStub.serialize()]
          }
        })

        fakeGame = testUtils.fakeGame({
          id: gameId,
          currentTurn: fakeFromPlayer.username,
          players: [fakeFromPlayer, fakeToPlayer]
        })

        fakeFromPlayer.game = fakeGame
        fakeToPlayer.game = fakeGame
      }

      function setupCardRequest () {
        fakeCardRequest = testUtils.fakeCardRequest({
          gameId: fakeGame.id,
          type: cardRequestTypes.SLY_DEAL,
          info: {
            fromUser: fakeFromPlayer.username,
            toUser: fakeToPlayer.username,
            setId: propertySetStub.getId(),
            card: expectedCardToSlyDeal
          }
        })
      }

      function setupCardRequestRepository () {
        cardRequestRepository = td.replace('../../repositories/CardRequestRepository').default
        td.when(cardRequestRepository.find(fakeCardRequest.id)).thenResolve(fakeCardRequest)
      }

      function setupPlayerRepository () {
        playerRepository = td.replace('../../repositories/PlayerRepository').default

        td.when(playerRepository.findByGameIdAndUsername(fakeGame.id, fakeFromPlayer.username))
          .thenResolve(fakeFromPlayer)

        td.when(playerRepository.findByGameIdAndUsername(fakeGame.id, fakeToPlayer.username))
          .thenResolve(fakeToPlayer)
      }

      function setupGameHistoryService () {
        gameHistoryService = td.replace('../GameHistoryService').default
      }
    })

    it('should delete the request and transfer the card over to requester', async function () {
      expect(fakeFromPlayer.placedCards.serializedPropertySets).to.be.empty
      expect(fakeToPlayer.placedCards.serializedPropertySets[0].cards).to.eql([expectedCardToSlyDeal])

      await cardRequestService.acceptSlyDeal(fakeCardRequest.id)

      td.verify(fakeCardRequest.delete(), { times: 1 })
      expect(fakeFromPlayer.placedCards.serializedPropertySets[0].cards).to.eql([expectedCardToSlyDeal])
      expect(fakeToPlayer.placedCards.serializedPropertySets).to.be.empty
    })

    it('should log the action', async function () {
      await cardRequestService.acceptSlyDeal(fakeCardRequest.id)

      td.verify(gameHistoryService.record(
        fakeGame.id,
        `${fakeFromPlayer.username} sly dealt ${expectedCardToSlyDeal} from ${fakeToPlayer.username}`,
        [fakeToPlayer.username]
      ), { times: 1 })
    })
  })
})
