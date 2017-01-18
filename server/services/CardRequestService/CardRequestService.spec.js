/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import td from 'testdouble'
import * as testUtils from '../../test-utils'
import {
  PROPERTY_BLUE,
  PROPERTY_BLACK,
  PROPERTY_WILDCARD,
  getCardObject
} from '../../../universal/monopoly/cards'
import PropertySet from '../../../universal/monopoly/PropertySet'
import cardRequestTypes, { SetCardType, LeftOverCardType } from '../../../universal/monopoly/cardRequestTypes'
import { markCard } from '../../../universal/monopoly/logMessageParser'

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

        const cardRequestOverride = {
          type: cardRequestTypes.SLY_DEAL,
          info: {
            cardType: SetCardType,
            setId: propertyBlueNonFullSetStub.getId(),
            card: expectedCardToSlyDeal
          }
        }

        setUpDependencies.bind(this)(gameId, fakeFromPlayerOverride, fakeToPlayerOverride, cardRequestOverride)
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
          `${this.fakeFromPlayer.username} sly dealt ` +
          `${markCard(expectedCardToSlyDeal)} from ${this.fakeToPlayer.username}`,
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

        const cardRequestOverride = {
          type: cardRequestTypes.SLY_DEAL,
          info: {
            cardType: LeftOverCardType,
            setId: null,
            card: expectedCardToSlyDeal
          }
        }

        setUpDependencies.bind(this)(gameId, fakeFromPlayerOverride, fakeToPlayerOverride, cardRequestOverride)
      })

      it('should delete the request and transfer the card over to requester', async function () {
        const previousFromPlayerSet = PropertySet.unserialize(this.fakeFromPlayer.placedCards.serializedPropertySets[0])
        expect(previousFromPlayerSet.isFullSet()).to.be.false
        expect(this.fakeToPlayer.placedCards.leftOverCards).to.eql([expectedCardToSlyDeal])

        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        td.verify(this.fakeCardRequest.delete(), { times: 1 })

        const currentFromPlayerSet = PropertySet.unserialize(this.fakeFromPlayer.placedCards.serializedPropertySets[0])
        expect(currentFromPlayerSet.isFullSet()).to.be.true
        expect(this.fakeToPlayer.placedCards.leftOverCards).to.be.empty
      })

      it('should log the action', async function () {
        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        td.verify(this.gameHistoryService.record(
          this.fakeGame.id,
          `${this.fakeFromPlayer.username} sly dealt ` +
          `${markCard(expectedCardToSlyDeal)} from ${this.fakeToPlayer.username}`,
          [this.fakeToPlayer.username]
        ), { times: 1 })
      })
    })
  })

  describe('#acceptForcedDeal', function () {
    const gameId = 'game-id'
    const propertyBlueNonFullSetStub = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE])
    const propertyBlackNonFullSetStub = new PropertySet(getCardObject(PROPERTY_BLACK), [PROPERTY_BLACK])

    describe('Given the forced deal card is of set card type', function () {
      const expectedFromUserCard = PROPERTY_BLACK
      const expectedToUserCard = PROPERTY_BLUE

      beforeEach(function () {
        const fakeFromPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [],
            serializedPropertySets: [
              propertyBlackNonFullSetStub.serialize(),
              propertyBlueNonFullSetStub.serialize()
            ]
          }
        }

        const fakeToPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [],
            serializedPropertySets: [propertyBlueNonFullSetStub.serialize()]
          }
        }

        const cardRequestOverride = {
          type: cardRequestTypes.FORCED_DEAL,
          info: {
            cardType: SetCardType,
            fromUserSetId: propertyBlackNonFullSetStub.getId(),
            toUserSetId: propertyBlueNonFullSetStub.getId(),
            fromUserCard: expectedFromUserCard,
            toUserCard: expectedToUserCard
          }
        }

        setUpDependencies.bind(this)(gameId, fakeFromPlayerOverride, fakeToPlayerOverride, cardRequestOverride)
      })

      it('should swap cards: card should go to the first non-full set and empty sets are removed', async function () {
        const previousFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        expect(previousFromPlayerSets.filter(set => set.isFullSet())).to.be.empty

        expect(this.fakeToPlayer.placedCards.serializedPropertySets).to.have.lengthOf(1)

        await this.cardRequestService.acceptForcedDeal(this.fakeCardRequest.id)

        const currentFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        const fromPlayerFullSets = currentFromPlayerSets.filter(set => set.isFullSet())
        expect(fromPlayerFullSets).to.have.lengthOf(1)
        expect(fromPlayerFullSets[0].identifier.key).to.equal(PROPERTY_BLUE)

        const currentToPlayerSets = this.fakeToPlayer.placedCards.serializedPropertySets.map(PropertySet.unserialize)
        expect(currentToPlayerSets).to.have.lengthOf(1)
        expect(currentToPlayerSets[0].identifier.key).to.equal(PROPERTY_BLACK)
      })
    })

    describe('Given the forced deal card is in the left over cards section', function () {
      const expectedFromUserCard = PROPERTY_BLACK
      const expectedToUserCard = PROPERTY_WILDCARD

      beforeEach(function () {
        const fakeFromPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [],
            serializedPropertySets: [
              propertyBlackNonFullSetStub.serialize(),
              propertyBlueNonFullSetStub.serialize()
            ]
          }
        }

        const fakeToPlayerOverride = {
          placedCards: {
            bank: [],
            leftOverCards: [PROPERTY_WILDCARD],
            serializedPropertySets: []
          }
        }

        const cardRequestOverride = {
          type: cardRequestTypes.FORCED_DEAL,
          info: {
            cardType: LeftOverCardType,
            fromUserSetId: propertyBlackNonFullSetStub.getId(),
            toUserSetId: null,
            fromUserCard: expectedFromUserCard,
            toUserCard: expectedToUserCard
          }
        }

        setUpDependencies.bind(this)(gameId, fakeFromPlayerOverride, fakeToPlayerOverride, cardRequestOverride)
      })

      it('should swap cards: card should go to the first non-full set and empty sets are removed', async function () {
        const previousFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        expect(previousFromPlayerSets.filter(set => set.isFullSet())).to.be.empty

        expect(this.fakeToPlayer.placedCards.leftOverCards).to.have.lengthOf(1)
        expect(this.fakeToPlayer.placedCards.serializedPropertySets).to.be.empty

        await this.cardRequestService.acceptForcedDeal(this.fakeCardRequest.id)

        const currentFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        const fromPlayerFullSets = currentFromPlayerSets.filter(set => set.isFullSet())
        expect(fromPlayerFullSets).to.have.lengthOf(1)
        expect(fromPlayerFullSets[0].identifier.key).to.equal(PROPERTY_BLUE)
        expect(fromPlayerFullSets[0].getCards()).to.contain(PROPERTY_WILDCARD)

        expect(this.fakeToPlayer.placedCards.leftOverCards).to.be.empty
        expect(this.fakeToPlayer.placedCards.serializedPropertySets).to.have.lengthOf(1)
      })
    })
  })

  function setUpDependencies (
    gameId: string,
    fakeFromPlayerOverride: Object,
    fakeToPlayerOverride: Object,
    cardRequestOverride: Object
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
        ...cardRequestOverride
      })

      this.fakeCardRequest.info.fromUser = this.fakeFromPlayer.username
      this.fakeCardRequest.info.toUser = this.fakeToPlayer.username
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
