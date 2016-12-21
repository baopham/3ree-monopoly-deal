/* @flow */
import {
  HOUSE,
  HOTEL,
  RENT_ALL_COLOUR
} from './cards'
import { getCardObject } from './monopoly'

export default class PropertySet {
  identifier: CardKey
  properties: CardKey[]
  numberOfPropertiesRequired: number

  constructor (identifier: CardKey, properties: CardKey[], numberOfPropertiesRequired: number) {
    this.identifier = identifier
    this.properties = properties
    this.numberOfPropertiesRequired = numberOfPropertiesRequired
  }

  addProperty (property: CardKey): boolean {
    // TODO house, hotel
    if (this.isFullSet()) {
      return false
    }

    this.properties.push(property)
    return true
  }

  getProperties () {
    return this.properties
  }

  isFullSet (): boolean {
    return this.properties.length === this.numberOfPropertiesRequired
  }

  getRentAmount () {
    const card = getCardObject(this.identifier)
    const numberOfProperties = this.properties.filter(p => p !== HOUSE && p !== HOTEL).length
    return card.rent[numberOfProperties - 1]
  }

  isRentable (rentCard: Card) {
    return rentCard.key === RENT_ALL_COLOUR || rentCard.forCards.includes(this.identifier)
  }
}
