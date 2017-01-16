/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import td from 'testdouble'
import * as testUtils from '../../test-utils'
import {
  PROPERTY_BLUE,
  PROPERTY_WILDCARD,
  getCardObject
} from '../../../universal/monopoly/cards'
import PropertySet from '../../../universal/monopoly/PropertySet'
import cardRequestTypes, { SetCardType, LeftOverCardType } from '../../../universal/monopoly/cardRequestTypes'
import type { CardType } from '../../../universal/monopoly/cardRequestTypes'

describe('CardRequestService', function () {
  afterEach(function () {
    td.reset()
  })

  describe('#acceptSlyDeal', function () {
    const gameId = 'game-id'
    const propertyBlueNonFullSetStub = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE])

    describe('Given the sly dealt card is of set card type', function () {
      const expectedCardToSlyDeal = propertyBlueNonFullSetStub.getCards()[0]

      beforeEach(function () {
        const fakeFromPlayerOverride = {}

        const fakeToPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [],
            serializedPropertySets: [propertyBlueNonFullSetStub.serialize()]
          }
        }

        setUpDependencies.bind(this)(SetCardType, expectedCardToSlyDeal, fakeFromPlayerOverride, fakeToPlayerOverride)
      })

      it('should delete the request and transfer the card over to requester', async function () {
        expect(this.fakeFromPlayer.placedCards.serializedPropertySets).to.be.empty
        expect(this.fakeToPlayer.placedCards.serializedPropertySets[0].cards).to.eql([expectedCardToSlyDeal])

        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        td.verify(this.fakeCardRequest.delete(), { times: 1 })
        expect(this.fakeFromPlayer.placedCards.serializedPropertySets[0].cards).to.eql([expectedCardToSlyDeal])
        expect(this.fakeToPlayer.placedCards.serializedPropertySets).to.be.empty
      })

      it('should log the action', async function () {
        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        td.verify(this.gameHistoryService.record(
          this.fakeGame.id,
          `${this.fakeFromPlayer.username} sly dealt ${expectedCardToSlyDeal} from ${this.fakeToPlayer.username}`,
          [this.fakeToPlayer.username]
        ), { times: 1 })
      })
    })

    describe('Given the sly dealt card is in the left over cards section', function () {
      const expectedCardToSlyDeal = PROPERTY_WILDCARD

      beforeEach(function () {
        const fakeFromPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [],
            serializedPropertySets: [propertyBlueNonFullSetStub.serialize()]
          }
        }

        const fakeToPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [PROPERTY_WILDCARD],
            serializedPropertySets: []
          }
        }

        setUpDependencies
          .bind(this)(LeftOverCardType, expectedCardToSlyDeal, fakeFromPlayerOverride, fakeToPlayerOverride)
      })

      it('should delete the request and transfer the card over to requester', async function () {
        let fromPlayerSet = PropertySet.unserialize(this.fakeFromPlayer.placedCards.serializedPropertySets[0])
        expect(fromPlayerSet.isFullSet()).to.be.false
        expect(this.fakeToPlayer.placedCards.leftOverCards).to.eql([expectedCardToSlyDeal])

        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        td.verify(this.fakeCardRequest.delete(), { times: 1 })

        fromPlayerSet = PropertySet.unserialize(this.fakeFromPlayer.placedCards.serializedPropertySets[0])
        expect(fromPlayerSet.isFullSet()).to.be.true
        expect(this.fakeToPlayer.placedCards.leftOverCards).to.be.empty
      })

      it('should log the action', async function () {
        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        td.verify(this.gameHistoryService.record(
          this.fakeGame.id,
          `${this.fakeFromPlayer.username} sly dealt ${expectedCardToSlyDeal} from ${this.fakeToPlayer.username}`,
          [this.fakeToPlayer.username]
        ), { times: 1 })
      })
    })

    function setUpDependencies (
      cardType: CardType,
      expectedCardToSlyDeal: CardKey,
      fakeFromPlayerOverride: Object,
      fakeToPlayerOverride: Object
    ) {
      this.cardRequestService = null
      this.fakeGame = null
      this.fakeFromPlayer = null
      this.fakeToPlayer = null
      this.gameHistoryService = null
      this.fakeCardRequest = null

      setupGameAndPlayers.bind(this)()
      setupCardRequest.bind(this)()
      setupCardRequestRepository.bind(this)()
      setupPlayerRepository.bind(this)()
      setupGameHistoryService.bind(this)()

      const CardRequestService = require('./CardRequestService').default

      this.cardRequestService = new CardRequestService()

      //////
      function setupGameAndPlayers () {
        this.fakeFromPlayer = testUtils.fakePlayer({
          id: 'foo-bar',
          gameId,
          ...fakeFromPlayerOverride
        })

        this.fakeToPlayer = testUtils.fakePlayer({
          id: 'foo-bar-2',
          gameId,
          ...fakeToPlayerOverride
        })

        this.fakeGame = testUtils.fakeGame({
          id: gameId,
          currentTurn: this.fakeFromPlayer.username,
          players: [this.fakeFromPlayer, this.fakeToPlayer]
        })

        this.fakeFromPlayer.game = this.fakeGame
        this.fakeToPlayer.game = this.fakeGame
      }

      function setupCardRequest () {
        this.fakeCardRequest = testUtils.fakeCardRequest({
          gameId: this.fakeGame.id,
          type: cardRequestTypes.SLY_DEAL,
          info: {
            cardType,
            fromUser: this.fakeFromPlayer.username,
            toUser: this.fakeToPlayer.username,
            setId: cardType === SetCardType ? propertyBlueNonFullSetStub.getId() : null,
            card: expectedCardToSlyDeal
          }
        })
      }

      function setupCardRequestRepository () {
        const cardRequestRepository = td.replace('../../repositories/CardRequestRepository').default
        td.when(cardRequestRepository.find(this.fakeCardRequest.id)).thenResolve(this.fakeCardRequest)
      }

      function setupPlayerRepository () {
        const playerRepository = td.replace('../../repositories/PlayerRepository').default

        td.when(playerRepository.findByGameIdAndUsername(this.fakeGame.id, this.fakeFromPlayer.username))
          .thenResolve(this.fakeFromPlayer)

        td.when(playerRepository.findByGameIdAndUsername(this.fakeGame.id, this.fakeToPlayer.username))
          .thenResolve(this.fakeToPlayer)
      }

      function setupGameHistoryService () {
        this.gameHistoryService = td.replace('../GameHistoryService').default
      }
    }
  })
})
