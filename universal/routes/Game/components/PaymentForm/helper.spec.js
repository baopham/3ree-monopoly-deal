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
  PROPERTY_WILDCARD,
  MONEY_1M,
  MONEY_2M
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
  describe('#cardIsSelected', function () {
    describe('Given an array of non-money tuples', function () {
      it('should return true if the card is selected', function () {
        const selected = [
          [PROPERTY_BLUE, 0, 1],
          [PROPERTY_RED, 1, 2]
        ]

        const tuple = [PROPERTY_BLUE, 0, 1]

        expect(helper.cardIsSelected(tuple, selected)).to.be.true
      })

      it('should return false if the card is not selected', function () {
        const selected = [
          [PROPERTY_BLUE, 0, 1],
          [PROPERTY_RED, 1, 2]
        ]

        const tuple = [PROPERTY_BLUE, 1, 1]

        expect(helper.cardIsSelected(tuple, selected)).to.be.false
      })
    })
    describe('Given an array of money tuples', function () {
      it('should return true if the card is selected', function () {
        const selected = [
          [MONEY_1M, 0],
          [MONEY_2M, 1]
        ]

        const tuple = [MONEY_1M, 0]

        expect(helper.cardIsSelected(tuple, selected)).to.be.true
      })

      it('should return false if the card is not selected', function () {
        const selected = [
          [MONEY_1M, 0],
          [MONEY_2M, 1]
        ]

        const tuple = [MONEY_1M, 1]

        expect(helper.cardIsSelected(tuple, selected)).to.be.false
      })
    })
  })
})
