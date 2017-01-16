/* @flow */
import {
  HOUSE,
  HOTEL,
  PROPERTY_WILDCARD,
  RENT_ALL_COLOUR,
  HOUSE_ADDON_AMOUNT,
  HOTEL_ADDON_AMOUNT,
  getCardObject
} from './cards'

export type PropertySetId = string

export default class PropertySet {
  identifier: Card
  cards: CardKey[]

  constructor (identifier: Card, cards: CardKey[]) {
    this.identifier = identifier
    this.cards = cards
  }

  static unserialize (serializedSet: SerializedPropertySet): PropertySet {
    return new PropertySet(serializedSet.identifier, serializedSet.cards)
  }

  addCard (card: CardKey): boolean {
    if (!this.canAddCard(card)) {
      return false
    }

    this.cards.push(card)
    return true
  }

  getProperties (): CardKey[] {
    return this.cards.filter(c => c !== HOUSE && c !== HOTEL)
  }

  getCards (): CardKey[] {
    return this.cards
  }

  canAddCard (card: CardKey): boolean {
    if (this.isFullSet() && card !== HOUSE && card !== HOTEL) {
      return false
    }

    if ([HOUSE, HOTEL].includes(card) && !this.identifier.canAddHouseOrHotel) {
      return false
    }

    if ([HOUSE, HOTEL].includes(card) && (this.cards.includes(card) || !this.isFullSet())) {
      return false
    }

    if (card === HOTEL && !this.cards.includes(HOUSE)) {
      return false
    }

    if (![HOUSE, HOTEL, PROPERTY_WILDCARD].includes(card) && getCardObject(card).treatAs !== this.identifier.key) {
      return false
    }

    return true
  }

  isFullSet (): boolean {
    return this.hasMoreThanJustWildcardProperties() && this.getProperties().length === this.identifier.needs
  }

  getRentAmount (): number {
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

  isRentable (rentCard: Card): boolean {
    return rentCard.key === RENT_ALL_COLOUR || rentCard.forCards.includes(this.identifier.key)
  }

  isEmpty (): boolean {
    return !this.cards.length
  }

  hasMoreThanJustWildcardProperties (): boolean {
    return this.getProperties().filter(card => card !== PROPERTY_WILDCARD).length > 0
  }

  removeInvalidCards (): CardKey[] {
    let copyOfCards = [...this.cards]
    let allInvalidCards = []

    if (!this.hasMoreThanJustWildcardProperties()) {
      allInvalidCards.push(...copyOfCards.filter(card => card === PROPERTY_WILDCARD))
      copyOfCards = copyOfCards.filter(card => card !== PROPERTY_WILDCARD)
    }

    const isNotFullSetYetHasHouseOrHotel = !this.isFullSet() &&
      (this.cards.includes(HOUSE) || this.cards.includes(HOTEL))

    if (isNotFullSetYetHasHouseOrHotel) {
      allInvalidCards.push(...copyOfCards.filter(card => card === HOUSE || card === HOTEL))
      copyOfCards = copyOfCards.filter(card => card !== HOUSE && card !== HOTEL)
    }

    const hasHotelYetNoHouse = this.cards.includes(HOTEL) && !this.cards.includes(HOUSE)

    if (hasHotelYetNoHouse) {
      allInvalidCards.push(...copyOfCards.filter(card => card === HOTEL))
      copyOfCards = copyOfCards.filter(card => card !== HOTEL)
    }

    this.cards = copyOfCards

    return allInvalidCards
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
      cards: [...this.getCards()],
      identifier: { ...this.identifier }
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
