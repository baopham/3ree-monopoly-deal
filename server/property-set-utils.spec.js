/* @flow */
/* eslint-env jest */
import {
  PROPERTY_BLUE,
  PROPERTY_WILDCARD,
  HOUSE,
  getCardObject
} from '../universal/monopoly/cards'
import * as propertySetUtils from './property-set-utils'

const propertyBlueIdentifier = getCardObject(PROPERTY_BLUE)

describe('Property Set utils', function () {
  describe('#cleanUpPlacedCards', function () {
    describe('Given the placed cards have some empty sets', function () {
      it('should clean up those empty sets', function () {
        const placedCards = {
          bank: [],
          serializedPropertySets: [
            { identifier: propertyBlueIdentifier, cards: [] }
          ],
          leftOverCards: []
        }

        const actualPlacedCards = propertySetUtils.cleanUpPlacedCards(placedCards)

        expect(actualPlacedCards.serializedPropertySets).toHaveLength(0)
      })
    })

    describe('Given the placed cards have some invalid cards in some of the sets', function () {
      it('should put those invalid cards to the left over section', function () {
        const placedCards = {
          bank: [],
          serializedPropertySets: [
            { identifier: propertyBlueIdentifier, cards: [HOUSE, PROPERTY_WILDCARD] },
            { identifier: propertyBlueIdentifier, cards: [PROPERTY_BLUE, PROPERTY_WILDCARD] }
          ],
          leftOverCards: []
        }

        const actualPlacedCards = propertySetUtils.cleanUpPlacedCards(placedCards)

        expect(actualPlacedCards.serializedPropertySets).toHaveLength(1)
        expect(actualPlacedCards.serializedPropertySets[0].cards).toEqual([PROPERTY_BLUE, PROPERTY_WILDCARD])
        expect(actualPlacedCards.leftOverCards).toEqual([PROPERTY_WILDCARD, HOUSE])
      })
    })
  })
})
