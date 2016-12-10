/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import {
  RENT_BLUE_OR_GREEN,
  PROPERTY_BLUE,
  PROPERTY_RED,
  BIRTHDAY
} from './cards'
import * as monopoly from './monopoly'

describe('monopoly', function () {
  describe('#canPlayCard', function () {
    it('should return true for a rent card if the player has a rentable card', function () {
      const rentCard = RENT_BLUE_OR_GREEN
      const placedCards: PlacedCards = {
        bank: [],
        properties: [
          RENT_BLUE_OR_GREEN,
          PROPERTY_BLUE
        ]
      }
      expect(monopoly.canPlayCard(rentCard, placedCards)).to.be.true
    })

    it('should return false for a rent card if the player has no rentable card', function () {
      const rentCard = RENT_BLUE_OR_GREEN
      const placedCards: PlacedCards = {
        bank: [],
        properties: [
          RENT_BLUE_OR_GREEN,
          PROPERTY_RED
        ]
      }
      expect(monopoly.canPlayCard(rentCard, placedCards)).to.be.false
    })

    it('should return true if the card is an action card', function () {
      const actionCard = BIRTHDAY
      const placedCards = {
        bank: [],
        properties: []
      }
      expect(monopoly.canPlayCard(actionCard, placedCards)).to.be.true
    })
  })
})
