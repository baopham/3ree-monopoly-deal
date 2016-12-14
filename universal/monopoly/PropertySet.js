/* @flow */
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
}
