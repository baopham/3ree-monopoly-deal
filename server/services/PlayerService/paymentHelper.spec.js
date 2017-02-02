/* @flow */
/* eslint-env jest */
import { PROPERTY_BLUE, RENT_BLUE_OR_GREEN, DOUBLE_RENT, getCardObject } from '../../../universal/monopoly/cards'
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
})
