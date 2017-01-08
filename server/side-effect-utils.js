/* @flow */
// To ensure we keep the same order of cards and sets when removing stuff, using side effects to keep it simple for now.

import * as monopoly from '../universal/monopoly/monopoly'
import type { PropertySetId } from '../universal/monopoly/PropertySet'

export function removeCardFromSetBySetId (
  card: CardKey,
  setId: PropertySetId,
  serializedPropertySets: SerializedPropertySet[]
): void {
  const setToUpdateIndex = serializedPropertySets
    .findIndex(s => monopoly.unserializePropertySet(s).getId() === setId)
  const setToUpdate = serializedPropertySets[setToUpdateIndex]
  removeCardFromSet(card, setToUpdate)
}

export function removeCardFromSet (card: CardKey, set: SerializedPropertySet): void {
  const cardIndex = set.cards.indexOf(card)
  set.cards.splice(cardIndex, 1)
}

export function removeFirstInstance<T> (item: T, array: Array<T>): void {
  const index = array.indexOf(item)
  array.splice(index, 1)
}
