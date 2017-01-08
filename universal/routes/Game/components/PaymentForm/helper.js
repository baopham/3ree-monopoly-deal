/* @flow */
import PropertySet from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

export type CardIndex = number
export type SerializedPropertySetIndex = number
export type MoneyCardTuple = [CardKey, CardIndex]
export type NonMoneyCardTuple = [CardKey, CardIndex, SerializedPropertySetIndex]

export function getMapOfNonMoneyCards (
  tuples: NonMoneyCardTuple[],
  serializedPropertySets: SerializedPropertySet[]
): Map<PropertySetId, CardKey[]> {
  const map: Map<PropertySetId, CardKey[]> = new Map()

  tuples.forEach(([card, cardIndex, setIndex]) => {
    const originalSet = PropertySet.unserialize(serializedPropertySets[setIndex])
    const setId = originalSet.getId()
    const cards = map.get(setId) || []
    cards.push(card)
    map.set(setId, cards)
  })

  return map
}

export function selectCard (tuple: Array<*>, tuples: Array<*>): Array<*> {
  return tuples.concat([tuple])
}

export function unselectCard (tuple: Array<*>, tuples: Array<*>): Array<*> {
  return tuples.filter(t => !tuplesAreEqual(t, tuple))
}

export function cardIsSelected (tuple: Array<*>, tuples: Array<*>): boolean {
  return !!tuples.find(t => tuplesAreEqual(t, tuple))
}

function tuplesAreEqual (a: Array<mixed>, b: Array<mixed>) {
  return a.length === b.length && a.every((item, index) => item === b[index])
}
