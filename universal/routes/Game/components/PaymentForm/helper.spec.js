/* @flow */
/* eslint-env jest */
import * as helper from './helper'
import {
  PROPERTY_BLUE,
  PROPERTY_RED,
  HOUSE,
  PROPERTY_WILDCARD,
  MONEY_1M,
  MONEY_2M,
  getCardObject
} from '../../../../monopoly/cards'
import PropertySet from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

describe('PaymentForm: helper', function () {
  describe('#getMapOfNonMoneyCards', function () {
    describe('Given I want to pay by giving some of the properties from my full sets', function () {
      it('should return a map of unique property set ids and the selected non-money cards', function () {
        const propertySets = [
          new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE]),
          new PropertySet(getCardObject(PROPERTY_RED), [PROPERTY_RED, PROPERTY_WILDCARD])
        ]

        const serializedPropertySets = propertySets.map(s => s.serialize())

        const nonMoneyCardTuples = [
          [PROPERTY_BLUE, 1, 0],
          [HOUSE, 2, 0],
          [PROPERTY_RED, 0, 1]
        ]

        const map: Map<PropertySetId, CardKey[]> = helper.getMapOfNonMoneyCards(
          nonMoneyCardTuples,
          serializedPropertySets
        )

        expect(map.size).toEqual(2)

        expect(map.get(propertySets[0].getId())).toEqual([PROPERTY_BLUE, HOUSE])
        expect(map.get(propertySets[1].getId())).toEqual([PROPERTY_RED])
      })
    })

    describe('Given I need to pay by giving the HOUSE from a full set', function () {
      it('should return a map of set id and selected card', function () {
        const propertySets = [
          new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE])
        ]

        const serializedPropertySets = propertySets.map(s => s.serialize())

        const nonMoneyCardTuples = [
          [HOUSE, 2, 0]
        ]

        const map: Map<PropertySetId, CardKey[]> = helper.getMapOfNonMoneyCards(
          nonMoneyCardTuples,
          serializedPropertySets
        )

        expect(map.size).toEqual(1)
        expect(map.get(propertySets[0].getId())).toEqual([HOUSE])
      })
    })
  })

  describe('#cardIsSelected', function () {
    describe('Given an array of non-money tuples', function () {
      it('should return true if the card is selected', function () {
        const selected = [
          [PROPERTY_BLUE, 0, 1],
          [PROPERTY_RED, 1, 2]
        ]

        const tuple = [PROPERTY_BLUE, 0, 1]

        expect(helper.cardIsSelected(tuple, selected)).toBe(true)
      })

      it('should return false if the card is not selected', function () {
        const selected = [
          [PROPERTY_BLUE, 0, 1],
          [PROPERTY_RED, 1, 2]
        ]

        const tuple = [PROPERTY_BLUE, 1, 1]

        expect(helper.cardIsSelected(tuple, selected)).toBe(false)
      })
    })

    describe('Given an array of money tuples', function () {
      it('should return true if the card is selected', function () {
        const selected = [
          [MONEY_1M, 'bank', 0],
          [MONEY_2M, 'bank', 1]
        ]

        const tuple = [MONEY_1M, 'bank', 0]

        expect(helper.cardIsSelected(tuple, selected)).toBe(true)
      })

      it('should return false if the card is not selected', function () {
        const selected = [
          [MONEY_1M, 'bank', 0],
          [MONEY_2M, 'bank', 1]
        ]

        const tuple = [MONEY_1M, 'bank', 1]

        expect(helper.cardIsSelected(tuple, selected)).toBe(false)
      })
    })
  })
})
