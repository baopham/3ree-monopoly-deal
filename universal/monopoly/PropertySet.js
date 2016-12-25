/* @flow */
import {
  HOUSE,
  HOTEL,
  PROPERTY_WILDCARD,
  RENT_ALL_COLOUR
} from './cards'

export default class PropertySet {
  identifier: Card
  cards: CardKey[]

  constructor (identifier: Card, cards: CardKey[]) {
    this.identifier = identifier
    this.cards = cards
  }

  addCard (card: CardKey): boolean {
    if (this.isFullSet() && card !== HOUSE && card !== HOTEL) {
      return false
    }

    if ((card === HOUSE || card === HOTEL) && (this.cards.includes(card) || !this.isFullSet())) {
      return false
    }

    if (card === HOTEL && !this.cards.includes(HOUSE)) {
      return false
    }

    this.cards.push(card)
    return true
  }

  getProperties () {
    return this.cards.filter(c => c !== HOUSE && c !== HOTEL)
  }

  getCards () {
    return this.cards
  }

  isFullSet (): boolean {
    return this.getProperties().length === this.identifier.needs
  }

  getRentAmount () {
    const numberOfProperties = this.getProperties().length
    return this.identifier.rent[numberOfProperties - 1]
  }

  isRentable (rentCard: Card) {
    return rentCard.key === RENT_ALL_COLOUR || rentCard.forCards.includes(this.identifier.key)
  }

  toArray (): CardKey[] {
    const cards = this.getProperties().filter(p => p !== PROPERTY_WILDCARD)

    if (this.cards.includes(HOUSE)) {
      cards.push(HOUSE)
    }

    if (this.cards.includes(HOTEL)) {
      cards.push(HOTEL)
    }

    if (this.cards.includes(PROPERTY_WILDCARD)) {
      cards.push(PROPERTY_WILDCARD)
    }

    return cards
  }

  serialize (): SerializedPropertySet {
    return {
      cards: this.getCards(),
      identifier: this.identifier
    }
  }

  equals (other: PropertySet): boolean {
    return this.identifier.key === other.identifier.key &&
    this.getCards().length === other.getCards().length &&
    this.getCards().filter(card => !other.getCards().includes(card)).length === 0
  }

  /**
   * Merge with another set.
   * Will return any left over cards that could not be merged.
   */
  mergeWith (other: PropertySet): ?CardKey[] {
    if (this.identifier.key !== other.identifier.key) {
      throw new Error('Cannot merge 2 sets of different colours')
    }

    if (other.isFullSet() || this.isFullSet()) {
      throw new Error('Cannot merge when one of the set is full')
    }

    const leftOverCards = other.getCards().filter(card => !this.addCard(card))

    if (leftOverCards.length) {
      return leftOverCards
    }
  }
}
