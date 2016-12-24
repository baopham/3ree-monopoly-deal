/* @flow */
/* eslint-env node, mocha */
import { expect } from 'chai'
import {
  PROPERTY_BLUE,
  HOTEL,
  HOUSE,
  PROPERTY_WILDCARD
} from './cards'
import PropertySet from './PropertySet'
import { getCardObject } from './monopoly'

const identifier = getCardObject(PROPERTY_BLUE)

describe('PropertySet', function () {
  describe('#addCard', function () {
    it('should not allow to add a property once it is a full set', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE, PROPERTY_BLUE])

      expect(propertySet.getCards()).to.have.lengthOf(2)
      expect(propertySet.isFullSet()).to.be.true
      expect(propertySet.addCard(PROPERTY_BLUE)).to.be.false
      expect(propertySet.getCards()).to.have.lengthOf(2)
    })

    it('should allow to add a property if it is not a full set', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE])

      expect(propertySet.getCards()).to.have.lengthOf(1)
      expect(propertySet.addCard(PROPERTY_BLUE)).to.be.true
      expect(propertySet.getCards()).to.have.lengthOf(2)
    })

    it('should not allow to add HOUSE if it is not a full set', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE])

      expect(propertySet.getCards()).to.have.lengthOf(1)
      expect(propertySet.isFullSet()).to.be.false
      expect(propertySet.addCard(HOUSE)).to.be.false
    })

    it('should not allow to add HOTEL if it is not a full set', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE])

      expect(propertySet.getCards()).to.have.lengthOf(1)
      expect(propertySet.isFullSet()).to.be.false
      expect(propertySet.addCard(HOTEL)).to.be.false
    })

    it('should not allow to add HOTEL if there is no HOUSE yet', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE, PROPERTY_BLUE])

      expect(propertySet.getCards()).to.have.lengthOf(2)
      expect(propertySet.isFullSet()).to.be.true
      expect(propertySet.addCard(HOTEL)).to.be.false
    })

    it('should allow to add HOTEL if there is a HOUSE', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE])

      expect(propertySet.getCards()).to.have.lengthOf(3)
      expect(propertySet.isFullSet()).to.be.true
      expect(propertySet.addCard(HOTEL)).to.be.true
      expect(propertySet.getCards()).to.have.lengthOf(4)
    })

    it('should allow to add a HOUSE or a HOTEL if is a full set', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE, PROPERTY_BLUE])

      expect(propertySet.getCards()).to.have.lengthOf(2)
      expect(propertySet.isFullSet()).to.be.true
      expect(propertySet.addCard(HOUSE)).to.be.true
      expect(propertySet.getCards()).to.have.lengthOf(3)
      expect(propertySet.addCard(HOTEL)).to.be.true
      expect(propertySet.getCards()).to.have.lengthOf(4)
    })

    it('should not allow to add more than one HOUSE', function () {
      const propertySet = new PropertySet(identifier, [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE])

      expect(propertySet.getCards()).to.have.lengthOf(3)
      expect(propertySet.addCard(HOUSE)).to.be.false
    })

    it('should not allow to add more than one HOTEL', function () {
      const cards = [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE, HOTEL]
      const propertySet = new PropertySet(identifier, cards)

      expect(propertySet.getCards()).to.have.lengthOf(4)
      expect(propertySet.addCard(HOTEL)).to.be.false
    })
  })

  describe('#toArray', function () {
    it('should return an array of all cards with the HOUSE, HOTEL, WILDCARD being at the end', function () {
      const cards = [HOUSE, PROPERTY_WILDCARD, PROPERTY_BLUE, PROPERTY_BLUE, HOTEL]
      const propertySet = new PropertySet(identifier, cards)

      const array = propertySet.toArray()
      expect(array).to.be.instanceof(Array)
      expect(array).to.eql([
        PROPERTY_BLUE,
        PROPERTY_BLUE,
        HOUSE,
        HOTEL,
        PROPERTY_WILDCARD
      ])
    })
  })
})
