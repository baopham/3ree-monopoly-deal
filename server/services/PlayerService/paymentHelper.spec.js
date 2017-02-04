/* @flow */
/* eslint-env jest */
import {
  PROPERTY_BLUE,
  PROPERTY_LIGHT_BLUE,
  RENT_BLUE_OR_GREEN,
  RENT_LIGHT_BLUE_OR_BROWN,
  DOUBLE_RENT,
  DEBT_COLLECTOR,
  PASS_GO,
  HOUSE,
  getCardObject
} from '../../../universal/monopoly/cards'
import * as paymentHelper from './paymentHelper'
import * as testUtils from '../../test-utils'

describe('PlayerService: paymentHelper', function () {
  describe('#getCardPaymentAmount', function () {
    const propertyBlueSet = {
      identifier: getCardObject(PROPERTY_BLUE),
      cards: [PROPERTY_BLUE]
    }

    describe('Given the player has played a DOUBLE_RENT in previous action', function () {
      it('should double the rent when the player plays a rent card', function () {
        const username = 'bao'

        const game = testUtils.fakeGame({
          discardedCards: [DOUBLE_RENT],
          lastCardPlayedBy: username
        })

        const player = testUtils.fakePlayer({
          game,
          username,
          actionCounter: 2,
          placedCards: {
            leftOverCards: [],
            bankCards: [],
            serializedPropertySets: [propertyBlueSet]
          }
        })

        const [baseAmount] = propertyBlueSet.identifier.rent

        const expectedPaymentAmount = baseAmount * 2

        expect(paymentHelper.getCardPaymentAmount(game, player, RENT_BLUE_OR_GREEN)).toEqual(expectedPaymentAmount)
      })
    })

    describe('Given the player has played 2 DOUBLE_RENT in previous actions', function () {
      it('should quadruple the rent when the player plays a rent card as the last action', function () {
        const username = 'bao'

        const game = testUtils.fakeGame({
          discardedCards: [DOUBLE_RENT, DOUBLE_RENT],
          lastCardPlayedBy: username
        })

        const player = testUtils.fakePlayer({
          game,
          username,
          actionCounter: 2,
          placedCards: {
            leftOverCards: [],
            bankCards: [],
            serializedPropertySets: [propertyBlueSet]
          }
        })

        const [baseAmount] = propertyBlueSet.identifier.rent

        const expectedPaymentAmount = baseAmount * 4

        expect(paymentHelper.getCardPaymentAmount(game, player, RENT_BLUE_OR_GREEN)).toEqual(expectedPaymentAmount)
      })
    })

    describe('Given the previous player has played a DOUBLE_RENT without a subsequent rent and ' +
      'the current player played a DOUBLE_RENT', function () {
      it('should only double the rent when the player plays a rent card', function () {
        const username = 'bao'

        const game = testUtils.fakeGame({
          discardedCards: [DOUBLE_RENT, DOUBLE_RENT],
          lastCardPlayedBy: username
        })

        const player = testUtils.fakePlayer({
          game,
          username,
          actionCounter: 1,
          placedCards: {
            leftOverCards: [],
            bankCards: [],
            serializedPropertySets: [propertyBlueSet]
          }
        })

        const [baseAmount] = propertyBlueSet.identifier.rent

        const expectedPaymentAmount = baseAmount * 2

        expect(paymentHelper.getCardPaymentAmount(game, player, RENT_BLUE_OR_GREEN)).toEqual(expectedPaymentAmount)
      })
    })
  })

  describe('Given the player plays a DEBT_COLLECTOR', function () {
    it('should return $5M', function () {
      const game = testUtils.fakeGame()

      const player = testUtils.fakePlayer({ game })

      expect(paymentHelper.getCardPaymentAmount(game, player, DEBT_COLLECTOR)).toEqual(5)
    })
  })

  describe('Given the player has a full set including a HOUSE and has played a DOUBLE_RENT a while back', function () {
    it('should not double the rent and add $3M to the rent', function () {
      const username = 'bao'

      const fullSet = {
        identifier: getCardObject(PROPERTY_LIGHT_BLUE),
        cards: [PROPERTY_LIGHT_BLUE, PROPERTY_LIGHT_BLUE, PROPERTY_LIGHT_BLUE, HOUSE]
      }

      const game = testUtils.fakeGame({
        discardedCards: [DOUBLE_RENT, PASS_GO]
      })

      const player = testUtils.fakePlayer({
        game,
        username,
        actionCounter: 2,
        placedCards: {
          leftOverCards: [],
          bankCards: [],
          serializedPropertySets: [fullSet]
        }
      })

      const expectedPaymentAmount = 6

      expect(paymentHelper.getCardPaymentAmount(game, player, RENT_LIGHT_BLUE_OR_BROWN)).toEqual(expectedPaymentAmount)
    })
  })
})
