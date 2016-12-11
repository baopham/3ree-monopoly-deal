/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import {
  RENT_BLUE_OR_GREEN,
  PROPERTY_BLUE_OR_GREEN,
  PROPERTY_PINK_OR_ORANGE,
  PROPERTY_BLUE,
  PROPERTY_RED,
  BIRTHDAY,
  FORCED_DEAL,
  RENT_ALL_COLOUR
} from './cards'
import * as monopoly from './monopoly'

describe('monopoly', function () {
  describe('#canPlayCard', function () {
    it('should return true for a rent card if the player has a rentable card', function () {
      const card = RENT_BLUE_OR_GREEN
      const placedCards: PlacedCards = {
        bank: [],
        properties: [
          RENT_BLUE_OR_GREEN,
          PROPERTY_BLUE
        ]
      }
      expect(monopoly.canPlayCard(card, placedCards)).to.be.true
    })

    it('should return false for a rent card if the player has no rentable card', function () {
      const card = RENT_BLUE_OR_GREEN
      const placedCards: PlacedCards = {
        bank: [],
        properties: [
          RENT_BLUE_OR_GREEN,
          PROPERTY_RED
        ]
      }
      expect(monopoly.canPlayCard(card, placedCards)).to.be.false
    })

    it('should return true if the card is an action card', function () {
      const actionCard = BIRTHDAY
      const placedCards = {
        bank: [],
        properties: []
      }
      expect(monopoly.canPlayCard(actionCard, placedCards)).to.be.true
    })

    describe('Given the card is a FORCED_DEAL', function () {
      it('should not return false if the player has no properties to trade with', function () {
        const card = FORCED_DEAL
        const placedCards: PlacedCards = {
          bank: [],
          properties: []
        }
        expect(monopoly.canPlayCard(card, placedCards)).to.be.false
      })

      it('should return true if the player has properties to trade with', function () {
        const card = FORCED_DEAL
        const placedCards: PlacedCards = {
          bank: [],
          properties: [
            PROPERTY_RED
          ]
        }
        expect(monopoly.canPlayCard(card, placedCards)).to.be.true
      })
    })

    describe('Given the card is a wildcard rent', function () {
      it('should return false if the player has no properties to rent', function () {
        const card = RENT_ALL_COLOUR
        const placedCards: PlacedCards = {
          bank: [],
          properties: []
        }
        expect(monopoly.canPlayCard(card, placedCards)).to.be.false
      })

      it('should return true if the player has properties to rent', function () {
        const card = RENT_ALL_COLOUR
        const placedCards: PlacedCards = {
          bank: [],
          properties: [
            PROPERTY_RED
          ]
        }
        expect(monopoly.canPlayCard(card, placedCards)).to.be.true
      })
    })

    describe('Given the card is a rent card', function () {
      describe('Given player has wildcard properties', function () {
        it('should return true if one or more of the wildcard properties are rentable', function () {
          const card = RENT_BLUE_OR_GREEN
          const placedCards: PlacedCards = {
            bank: [],
            properties: [
              PROPERTY_BLUE_OR_GREEN
            ]
          }
          expect(monopoly.canPlayCard(card, placedCards)).to.be.true
        })

        it('should return false if none of the wildcard properties are rentable', function () {
          const card = RENT_BLUE_OR_GREEN
          const placedCards: PlacedCards = {
            bank: [],
            properties: [
              PROPERTY_PINK_OR_ORANGE
            ]
          }
          expect(monopoly.canPlayCard(card, placedCards)).to.be.false
        })
      })
    })
  })
})
