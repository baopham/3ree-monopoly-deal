/* @flow */
import PropertySet from './PropertySet'

export default class WildcardSet extends PropertySet {
  isFullSet (): boolean {
    return false
  }
}
