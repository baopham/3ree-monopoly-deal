/* @flow */
/* eslint-env jest */
import { getCardObject, PROPERTY_BLUE } from './cards'
import PropertySet from '../monopoly/PropertySet'
import * as logMessageParser from './logMessageParser'

describe('logMessageParser', function () {
  describe('#markSet', function () {
    it('should mark the set', function () {
      const propertySet = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE])
      const expected = `card:PROPERTY_BLUE:card card:PROPERTY_BLUE:card`
      
      expect(logMessageParser.markSet(propertySet.getId())).toBe(expected)
    })
  })
})
