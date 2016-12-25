/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import * as helper from './helper'
import * as monopoly from '../../../../../universal/monopoly/monopoly'
import PropertySet from '../../../../../universal/monopoly/PropertySet'
import {
  PROPERTY_BLUE,
  PROPERTY_RED,
  HOUSE,
  PROPERTY_WILDCARD
} from '../../../../../universal/monopoly/cards'

describe('PaymentForm: helper', function () {
  describe('#getSerializedPropertySetsFromMoneyCardTuples', function () {
    describe('Given I want to pay by giving some of the properties from my full sets', function () {
      it('should return an array of serialized property sets from the selected non-money cards ' +
        'and a list of cards that could not go into a set', function () {
        const serializedPropertySets = [
          new PropertySet(monopoly.getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE]).serialize(),
          new PropertySet(monopoly.getCardObject(PROPERTY_RED), [PROPERTY_RED, PROPERTY_WILDCARD]).serialize()
        ]

        const nonMoneyCardTuples = [
          [PROPERTY_BLUE, 1, 0],
          [HOUSE, 2, 0],
          [PROPERTY_RED, 0, 1]
        ]

        const [sets, leftOverCards] = helper.getSerializedPropertySetsFromMoneyCardTuples(
          nonMoneyCardTuples,
          serializedPropertySets
        )

        expect(leftOverCards).to.eql([HOUSE])

        expect(sets).to.have.lengthOf(2)

        expect(sets.shift()).to.eql({
          identifier: monopoly.getCardObject(PROPERTY_BLUE),
          cards: [PROPERTY_BLUE]
        })

        expect(sets.shift()).to.eql({
          identifier: monopoly.getCardObject(PROPERTY_RED),
          cards: [PROPERTY_RED]
        })
      })
    })

    describe('Given I need to pay by giving my full sets including HOUSE, HOTEL', function () {
      it('should return an array of serialized property sets from the selected non-money cards ' +
        'and an empty list of left over cards', function () {
        const serializedPropertySets = [
          new PropertySet(monopoly.getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_WILDCARD, HOUSE]).serialize()
        ]

        const nonMoneyCardTuples = [
          [PROPERTY_BLUE, 0, 0],
          [PROPERTY_WILDCARD, 1, 0],
          [HOUSE, 2, 0]
        ]

        const [sets, leftOverCards] = helper.getSerializedPropertySetsFromMoneyCardTuples(
          nonMoneyCardTuples,
          serializedPropertySets
        )

        expect(leftOverCards).to.be.empty

        expect(sets).to.have.lengthOf(1)

        expect(sets.shift()).to.eql({
          identifier: monopoly.getCardObject(PROPERTY_BLUE),
          cards: [PROPERTY_BLUE, PROPERTY_WILDCARD, HOUSE]
        })
      })
    })
  })
})
