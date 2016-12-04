import { expect } from 'chai'
import {
  CARDS,
  RENT_BLUE_OR_GREEN,
  PROPERTY_BLUE,
  PROPERTY_RED,
  BIRTHDAY,
  RENT_CARD_TYPE,
} from './cards'
import * as monopoly from './monopoly'


describe('monopoly', function () {
  describe('#canPlayCard', function () {
    it('should return true for a rent card if the hand has a rentable card', function () {
      const rentCard = RENT_BLUE_OR_GREEN
      const cardsOnHand = [
        RENT_BLUE_OR_GREEN,
        PROPERTY_BLUE
      ]
      expect(monopoly.canPlayCard(rentCard, cardsOnHand)).to.be.true
    })

    it('should return false for a rent card if the hand has no rentable card', function () {
      const rentCard = RENT_BLUE_OR_GREEN
      const cardsOnHand = [
        RENT_BLUE_OR_GREEN,
        PROPERTY_RED
      ]
      expect(monopoly.canPlayCard(rentCard, cardsOnHand)).to.be.false
    })

    it('should return true if the card is an action card', function () {
      const actionCard = BIRTHDAY
      expect(monopoly.canPlayCard(actionCard)).to.be.true
    })
  })
})
