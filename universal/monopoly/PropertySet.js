/* @flow */
export default class PropertySet {
  properties: CardKey[]
  numberOfPropertiesRequired: number

  constructor (properties: CardKey[], numberOfPropertiesRequired: number) {
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
