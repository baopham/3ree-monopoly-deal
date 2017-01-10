/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import {
  PROPERTY_BLUE,
  PROPERTY_WILDCARD,
  HOUSE
} from '../universal/monopoly/cards'
import { getCardObject } from '../universal/monopoly/monopoly'
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

        expect(actualPlacedCards.serializedPropertySets).to.be.empty
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

        expect(actualPlacedCards.serializedPropertySets).to.have.lengthOf(1)
        expect(actualPlacedCards.serializedPropertySets[0].cards).to.eql([PROPERTY_BLUE, PROPERTY_WILDCARD])
        expect(actualPlacedCards.leftOverCards).to.eql([PROPERTY_WILDCARD, HOUSE])
      })
    })
  })
})
