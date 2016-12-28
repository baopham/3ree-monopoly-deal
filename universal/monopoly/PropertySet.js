/* @flow */
import {
  HOUSE,
  HOTEL,
  PROPERTY_WILDCARD,
  RENT_ALL_COLOUR,
  HOUSE_ADDON_AMOUNT,
  HOTEL_ADDON_AMOUNT
} from './cards'

export type PropertySetId = string

export default class PropertySet {
  identifier: Card
  cards: CardKey[]

  constructor (identifier: Card, cards: CardKey[]) {
    this.identifier = identifier
    this.cards = cards
  }

  addCard (card: CardKey): boolean {
    if (!this.canAddCard(card)) {
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

  canAddCard (card: CardKey): boolean {
    if (this.isFullSet() && card !== HOUSE && card !== HOTEL) {
      return false
    }

    if ((card === HOUSE || card === HOTEL) && (this.cards.includes(card) || !this.isFullSet())) {
      return false
    }

    if (card === HOTEL && !this.cards.includes(HOUSE)) {
      return false
    }

    return true
  }

  isFullSet (): boolean {
    return this.getProperties().length === this.identifier.needs
  }

  getRentAmount () {
    const numberOfProperties = this.getProperties().length
    let rent = this.identifier.rent[numberOfProperties - 1]

    if (this.cards.includes(HOUSE)) {
      rent += HOUSE_ADDON_AMOUNT
    }

    if (this.cards.includes(HOTEL)) {
      rent += HOTEL_ADDON_AMOUNT
    }

    return rent
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
    return this.getId() === other.getId()
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

  static sortCards (cards: CardKey[]): CardKey[] {
    const sortedCards = cards.filter(c => c !== HOUSE && c !== HOTEL && c !== PROPERTY_WILDCARD).sort()

    if (sortedCards.length === cards.length) {
      return sortedCards
    }

    if (cards.includes(PROPERTY_WILDCARD)) {
      sortedCards.push(PROPERTY_WILDCARD)
    }

    if (cards.includes(HOUSE)) {
      sortedCards.push(HOUSE)
    }

    if (cards.includes(HOTEL)) {
      sortedCards.push(HOTEL)
    }

    return sortedCards
  }

  static fromIdToIdentifierKey (id: PropertySetId): string {
    const [identifierKey] = id.split(':')
    return identifierKey
  }

  getId (): PropertySetId {
    return `${this.identifier.key}:${PropertySet.sortCards(this.cards).join('-')}`
  }
}
