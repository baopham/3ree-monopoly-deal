/* @flow */
/* eslint-env jest */
import * as cards from './cards'

describe('cards', function () {
  describe('#newDeck', function () {
    it('should return 106 cards in random order', function () {
      const firstShuffle = cards.newDeck()

      expect(firstShuffle).toHaveLength(106)

      const secondShuffle = cards.newDeck()

      expect(secondShuffle).toHaveLength(106)

      // Not likely that it would result in the same order
      expect(firstShuffle).not.toEqual(secondShuffle)
    })
  })
})
