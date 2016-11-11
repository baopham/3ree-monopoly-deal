import {
  RENT_CARD_TYPE,
  MONEY_CARD_TYPE,
  PROPERTY_CARD_TYPE,
  CARDS
} from './cards'

const MAX_NUMBER_OF_CARDS = 7;

export default class Hand {
  constructor (cards = []) {
    this.cards = cards
  }

  add (card = { count, value, type, ...rest }) {
    this.cards = this.cards.concat([card])
    return this
  }

  remove (card) {
    this.cards = this.cards.filter(c => c === card)
    return this
  }

  getRentCards () {
    return this.cards.filter(c => c.type === RENT_CARD_TYPE)
  }

  getMoneyCards () {
    return this.cards.filter(c => c.type === MONEY_CARD_TYPE)
  }

  getPropertiesOfType (type) {
    return this.cards.filter(c => c.type === PROPERTY_CARD_TYPE && c === CARDS[type])
  }

  getAllProperties () {
    return this.cards.filter(c => c.type === PROPERTY_CARD_TYPE)
  }

  getPropertiesAndTheirCounts () {
    const properties = this.getAllProperties()

    const sets = new Map()

    const properties.map(card => {
      if (!sets.has(card)) {
        sets.set(card, 0)
      }

      sets.set(card, sets.get(card) + 1)
    })

    return sets
  }

  getFullSets () {
    const sets = this.getPropertiesAndTheirCounts()

    const fullSets = []

    sets.forEach((count, card) => {
      if (card.count >= count) {
        fullSets.push(card)
      }
    })

    return fullSets
  }

  count () {
    return this.cards.length
  }

  hasTooMany () {
    return this.count() > MAX_NUMBER_OF_CARDS
  }

  getNumberOfCardsToDiscard () {
    return Math.max(0, this.count() - MAX_NUMBER_OF_CARDS)
  }
}
