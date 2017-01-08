/* @flow */
// To ensure we keep the same order of cards and sets when removing stuff, using side effects to keep it simple for now.

import PropertySet from '../universal/monopoly/PropertySet'
import type { PropertySetId } from '../universal/monopoly/PropertySet'

export function removeCardFromSetBySetId (
  card: CardKey,
  setId: PropertySetId,
  serializedPropertySets: SerializedPropertySet[]
): void {
  const setToUpdateIndex = serializedPropertySets
    .findIndex(s => PropertySet.unserialize(s).getId() === setId)
  const setToUpdate = serializedPropertySets[setToUpdateIndex]
  removeCardFromSet(card, setToUpdate)
}

export function removeCardFromSet (card: CardKey, set: SerializedPropertySet): void {
  const cardIndex = set.cards.indexOf(card)
  set.cards.splice(cardIndex, 1)
}

export function removeFirstInstanceFromArray<T> (item: T, array: Array<T>): void {
  const index = array.indexOf(item)
  array.splice(index, 1)
}

export function removeSetFromPlacedCardsBySetIndex (setIndex: number, placedCards: PlacedCards): void {
  placedCards.serializedPropertySets.splice(setIndex, 1)
}

export function addSetToPlacedCards (newSet: SerializedPropertySet, placedCards: PlacedCards): void {
  placedCards.serializedPropertySets.push(newSet)
}

export function replaceItemInArray<T> (array: Array<T>, index: number, replaceWith: T): void {
  array[index] = replaceWith
}

export function addItemToArray<T> (item: T, array: Array<T>): void {
  array.push(item)
}
