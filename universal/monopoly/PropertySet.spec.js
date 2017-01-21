/* @flow */
/* eslint-env jest */
import {
  PROPERTY_GREEN,
  PROPERTY_BLUE,
  HOTEL,
  HOUSE,
  PROPERTY_WILDCARD,
  PROPERTY_BLACK,
  PROPERTY_LIGHT_GREEN,
  getCardObject
} from './cards'
import PropertySet from './PropertySet'

const propertyBlueIdentifier = getCardObject(PROPERTY_BLUE)

describe('PropertySet', function () {
  describe('#addCard', function () {
    it('should not allow to add a property once it is a full set', function () {
      const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, PROPERTY_BLUE])

      expect(propertySet.getCards()).toHaveLength(2)
      expect(propertySet.isFullSet()).toBe(true)
      expect(propertySet.addCard(PROPERTY_BLUE)).toBe(false)
      expect(propertySet.getCards()).toHaveLength(2)
    })

    it('should allow to add a property if it is not a full set', function () {
      const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])

      expect(propertySet.getCards()).toHaveLength(1)
      expect(propertySet.addCard(PROPERTY_BLUE)).toBe(true)
      expect(propertySet.getCards()).toHaveLength(2)
    })

    describe('Given the card being added is a HOUSE or a HOTEL and the set is not railroad or utility', function () {
      it('should not allow to add HOUSE if it is not a full set', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])

        expect(propertySet.getCards()).toHaveLength(1)
        expect(propertySet.isFullSet()).toBe(false)
        expect(propertySet.addCard(HOUSE)).toBe(false)
      })

      it('should not allow to add HOTEL if it is not a full set', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])

        expect(propertySet.getCards()).toHaveLength(1)
        expect(propertySet.isFullSet()).toBe(false)
        expect(propertySet.addCard(HOTEL)).toBe(false)
      })

      it('should not allow to add HOTEL if there is no HOUSE yet', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, PROPERTY_BLUE])

        expect(propertySet.getCards()).toHaveLength(2)
        expect(propertySet.isFullSet()).toBe(true)
        expect(propertySet.addCard(HOTEL)).toBe(false)
      })

      it('should allow to add HOTEL if there is a HOUSE', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE])

        expect(propertySet.getCards()).toHaveLength(3)
        expect(propertySet.isFullSet()).toBe(true)
        expect(propertySet.addCard(HOTEL)).toBe(true)
        expect(propertySet.getCards()).toHaveLength(4)
      })

      it('should allow to add a HOUSE or a HOTEL if is a full set', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, PROPERTY_BLUE])

        expect(propertySet.getCards()).toHaveLength(2)
        expect(propertySet.isFullSet()).toBe(true)
        expect(propertySet.addCard(HOUSE)).toBe(true)
        expect(propertySet.getCards()).toHaveLength(3)
        expect(propertySet.addCard(HOTEL)).toBe(true)
        expect(propertySet.getCards()).toHaveLength(4)
      })

      it('should not allow to add more than one HOUSE', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE])

        expect(propertySet.getCards()).toHaveLength(3)
        expect(propertySet.addCard(HOUSE)).toBe(false)
      })

      it('should not allow to add more than one HOTEL', function () {
        const cards = [PROPERTY_BLUE, PROPERTY_BLUE, HOUSE, HOTEL]
        const propertySet = new PropertySet(propertyBlueIdentifier, cards)

        expect(propertySet.getCards()).toHaveLength(4)
        expect(propertySet.addCard(HOTEL)).toBe(false)
      })
    })

    describe('Given the card being added is a HOUSE or a HOTEL and the set is a railroad or utility', function () {
      describe('Given the set is a railroad', function () {
        it('should not allow to add HOUSE or HOTEL', function () {
          const cards = [PROPERTY_BLACK, PROPERTY_BLACK, PROPERTY_BLACK, PROPERTY_BLACK]
          const propertySet = new PropertySet(getCardObject(PROPERTY_BLACK), cards)

          expect(propertySet.isFullSet()).toBe(true)
          expect(propertySet.addCard(HOUSE)).toBe(false)
          expect(propertySet.addCard(HOTEL)).toBe(false)
        })
      })

      describe('Given the set is a utility', function () {
        it('should not allow to add HOUSE or HOTEL', function () {
          const cards = [PROPERTY_LIGHT_GREEN, PROPERTY_LIGHT_GREEN]
          const propertySet = new PropertySet(getCardObject(PROPERTY_LIGHT_GREEN), cards)

          expect(propertySet.isFullSet()).toBe(true)
          expect(propertySet.addCard(HOUSE)).toBe(false)
          expect(propertySet.addCard(HOTEL)).toBe(false)
        })
      })
    })

    describe('Given the card being added is not of the same colour', function () {
      it('should not allow to add the card', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])

        expect(propertySet.addCard(PROPERTY_BLACK)).toBe(false)
      })
    })
  })

  describe('#toArray', function () {
    it('should return an array of all cards with the HOUSE, HOTEL, WILDCARD being at the end', function () {
      const cards = [HOUSE, PROPERTY_WILDCARD, PROPERTY_BLUE, PROPERTY_BLUE, HOTEL]
      const propertySet = new PropertySet(propertyBlueIdentifier, cards)

      const array = propertySet.toArray()
      expect(array).toBeInstanceOf(Array)
      expect(array).toEqual([
        PROPERTY_BLUE,
        PROPERTY_BLUE,
        HOUSE,
        HOTEL,
        PROPERTY_WILDCARD
      ])
    })
  })

  describe('#equals', function () {
    it('should return true if 2 property sets have the same identifier and cards', function () {
      const thisPropertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])
      const thatPropertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])

      expect(thisPropertySet.equals(thatPropertySet)).toBe(true)
    })

    it('should return false if 2 property sets do not have the same identifier or cards', function () {
      let thisPropertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, PROPERTY_WILDCARD])
      let thatPropertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE])

      expect(thisPropertySet.equals(thatPropertySet)).toBe(false)

      thisPropertySet = new PropertySet(getCardObject(PROPERTY_GREEN), [])
      thatPropertySet = new PropertySet(propertyBlueIdentifier, [])

      expect(thisPropertySet.equals(thatPropertySet)).toBe(false)
    })
  })

  describe('#removeInvalidCards', function () {
    describe('Given the set has only wildcard (for all colour)', function () {
      it('should remove all the wildcards and return them as an array', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_WILDCARD, PROPERTY_WILDCARD])
        const invalidCards = propertySet.removeInvalidCards()

        expect(propertySet.getCards()).toHaveLength(0)
        expect(invalidCards).toEqual([PROPERTY_WILDCARD, PROPERTY_WILDCARD])
      })
    })

    describe('Given the set has house and hotel yet it is not a full set', function () {
      it('should remove all the house and hotel cards and return them as an array', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, HOUSE, HOTEL])
        const invalidCards = propertySet.removeInvalidCards()

        expect(propertySet.getCards()).toEqual([PROPERTY_BLUE])
        expect(invalidCards).toEqual([HOUSE, HOTEL])
      })
    })

    describe('Given the set has a hotel yet has no house', function () {
      it('should remove all the hotel cards and return them as an array', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_BLUE, HOTEL])
        const invalidCards = propertySet.removeInvalidCards()

        expect(propertySet.getCards()).toEqual([PROPERTY_BLUE])
        expect(invalidCards).toEqual([HOTEL])
      })
    })

    describe('Given the set only has wildcard, house and hotel', function () {
      it('should remove all the wildcard, house and hotel and return them as an array', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_WILDCARD, HOUSE, HOTEL])
        const invalidCards = propertySet.removeInvalidCards()

        expect(propertySet.getCards()).toHaveLength(0)
        expect(invalidCards).toEqual([PROPERTY_WILDCARD, HOUSE, HOTEL])
      })
    })

    describe('Given the set has a normal property card, wildcard, house and hotel but is not a full set', function () {
      it('should remove the house and hotel and return them as an array', function () {
        const propertySet = new PropertySet(getCardObject(PROPERTY_BLACK), [
          PROPERTY_BLACK,
          PROPERTY_WILDCARD,
          HOUSE,
          HOTEL
        ])

        const invalidCards = propertySet.removeInvalidCards()

        expect(propertySet.getCards()).toEqual([PROPERTY_BLACK, PROPERTY_WILDCARD])
        expect(invalidCards).toEqual([HOUSE, HOTEL])
      })
    })
  })

  describe('#isFullSet', function () {
    describe('Given the set has enough cards to form a full set but they are all wildcards', function () {
      it('should return false', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_WILDCARD, PROPERTY_WILDCARD])

        expect(propertySet.isFullSet()).toBe(false)
      })
    })

    describe('Given the set has enough cards to form a full set', function () {
      it('should return true', function () {
        const propertySet = new PropertySet(propertyBlueIdentifier, [PROPERTY_WILDCARD, PROPERTY_BLUE])

        expect(propertySet.isFullSet()).toBe(true)
      })
    })
  })
})
