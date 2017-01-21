/* @flow */
/* eslint-env jest */
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

jest.mock('../../thinky')

describe('CardRequestService', function () {
  afterEach(() => {
    jest.resetAllMocks().resetModules()
  })

  describe('#acceptSlyDeal', function () {
    const gameId = 'game-id'
    const propertyBlueNonFullSetStub = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE])

    describe('Given the sly dealt card is of set card type', () => {
      const expectedCardToSlyDeal = propertyBlueNonFullSetStub.getCards()[0]

      beforeEach(() => {
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

      it('should delete the request and transfer the card over to requester', async () => {
        expect(this.fakeFromPlayer.placedCards.serializedPropertySets).toHaveLength(0)
        expect(this.fakeToPlayer.placedCards.serializedPropertySets[0].cards).toEqual([expectedCardToSlyDeal])

        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        expect(this.fakeCardRequest.delete).toHaveBeenCalledTimes(1)
        expect(this.fakeFromPlayer.placedCards.serializedPropertySets[0].cards).toEqual([expectedCardToSlyDeal])
        expect(this.fakeToPlayer.placedCards.serializedPropertySets).toHaveLength(0)
      })

      it('should log the action', async () => {
        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        expect(this.cardRequestService.gameHistoryService.record)
          .toHaveBeenCalledWith(
            this.fakeGame.id,
            `${this.fakeFromPlayer.username} sly dealt ` +
            `${markCard(expectedCardToSlyDeal)} from ${this.fakeToPlayer.username}`,
            [this.fakeToPlayer.username]
          )
      })
    })

    describe('Given the sly dealt card is in the left over cards section', function () {
      const expectedCardToSlyDeal = PROPERTY_WILDCARD

      beforeEach(() => {
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

      it('should delete the request and transfer the card over to requester', async () => {
        const previousFromPlayerSet = PropertySet.unserialize(this.fakeFromPlayer.placedCards.serializedPropertySets[0])
        expect(previousFromPlayerSet.isFullSet()).toBe(false)
        expect(this.fakeToPlayer.placedCards.leftOverCards).toEqual([expectedCardToSlyDeal])

        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        expect(this.fakeCardRequest.delete).toHaveBeenCalledTimes(1)

        const currentFromPlayerSet = PropertySet.unserialize(this.fakeFromPlayer.placedCards.serializedPropertySets[0])
        expect(currentFromPlayerSet.isFullSet()).toBe(true)
        expect(this.fakeToPlayer.placedCards.leftOverCards).toHaveLength(0)
      })

      it('should log the action', async () => {
        await this.cardRequestService.acceptSlyDeal(this.fakeCardRequest.id)

        expect(this.cardRequestService.gameHistoryService.record)
          .toHaveBeenCalledWith(
            this.fakeGame.id,
            `${this.fakeFromPlayer.username} sly dealt ` +
            `${markCard(expectedCardToSlyDeal)} from ${this.fakeToPlayer.username}`,
            [this.fakeToPlayer.username]
          )
      })
    })
  })

  describe('#acceptForcedDeal', function () {
    const gameId = 'game-id'
    const propertyBlueNonFullSetStub = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE])
    const propertyBlackNonFullSetStub = new PropertySet(getCardObject(PROPERTY_BLACK), [PROPERTY_BLACK])

    describe('Given the forced deal card is of set card type', () => {
      const expectedFromUserCard = PROPERTY_BLACK
      const expectedToUserCard = PROPERTY_BLUE

      beforeEach(() => {
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

      it('should swap cards: card should go to the first non-full set and empty sets are removed', async () => {
        const previousFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        expect(previousFromPlayerSets.filter(set => set.isFullSet())).toHaveLength(0)

        expect(this.fakeToPlayer.placedCards.serializedPropertySets).toHaveLength(1)

        await this.cardRequestService.acceptForcedDeal(this.fakeCardRequest.id)

        const currentFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        const fromPlayerFullSets = currentFromPlayerSets.filter(set => set.isFullSet())
        expect(fromPlayerFullSets).toHaveLength(1)
        expect(fromPlayerFullSets[0].identifier.key).toBe(PROPERTY_BLUE)

        const currentToPlayerSets = this.fakeToPlayer.placedCards.serializedPropertySets.map(PropertySet.unserialize)
        expect(currentToPlayerSets).toHaveLength(1)
        expect(currentToPlayerSets[0].identifier.key).toBe(PROPERTY_BLACK)
      })
    })

    describe('Given the forced deal card is in the left over cards section', function () {
      const expectedFromUserCard = PROPERTY_BLACK
      const expectedToUserCard = PROPERTY_WILDCARD

      beforeEach(() => {
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

      it('should swap cards: card should go to the first non-full set and empty sets are removed', async () => {
        const previousFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        expect(previousFromPlayerSets.filter(set => set.isFullSet())).toHaveLength(0)

        expect(this.fakeToPlayer.placedCards.leftOverCards).toHaveLength(1)
        expect(this.fakeToPlayer.placedCards.serializedPropertySets).toHaveLength(0)

        await this.cardRequestService.acceptForcedDeal(this.fakeCardRequest.id)

        const currentFromPlayerSets = this.fakeFromPlayer
          .placedCards.serializedPropertySets.map(PropertySet.unserialize)
        const fromPlayerFullSets = currentFromPlayerSets.filter(set => set.isFullSet())
        expect(fromPlayerFullSets).toHaveLength(1)
        expect(fromPlayerFullSets[0].identifier.key).toBe(PROPERTY_BLUE)
        expect(fromPlayerFullSets[0].getCards()).toContain(PROPERTY_WILDCARD)

        expect(this.fakeToPlayer.placedCards.leftOverCards).toHaveLength(0)
        expect(this.fakeToPlayer.placedCards.serializedPropertySets).toHaveLength(1)
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
      jest.mock('../../repositories/CardRequestRepository', () => () => ({
        find: () => Promise.resolve(this.fakeCardRequest)
      }))
    }

    function setupPlayerRepository () {
      jest.mock('../../repositories/PlayerRepository', () => () => ({
        findByGameIdAndUsername: (gameId, username) => {
          const returnedValues = {
            [this.fakeFromPlayer.username]: this.fakeFromPlayer,
            [this.fakeToPlayer.username]: this.fakeToPlayer
          }

          return returnedValues[username]
        }
      }))
    }

    function setupGameHistoryService () {
      jest.mock('../GameHistoryService', () => jest.genMockFromModule('../GameHistoryService'))
    }
  }
})
