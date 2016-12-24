/* @flow */
import PropertySet from './PropertySet'

export default class WildcardSet extends PropertySet {
  identifier: Card
  properties: CardKey[]
  numberOfPropertiesRequired: number

  constructor (identifier: Card, properties: CardKey[]) {
    super(identifier, properties, 0)
    this.identifier = identifier
    this.properties = properties
  }

  isFullSet (): boolean {
    return false
  }
}
