/* @flow */
import PropertySet from '../universal/monopoly/PropertySet'
import type { PropertySetId } from '../universal/monopoly/PropertySet'

export function cleanUpPlacedCards (placedCards: PlacedCards): PlacedCards {
  const invalidCardsInSets = []

  const cleanSets = placedCards.serializedPropertySets.map(set => {
    const unserializedSet = PropertySet.unserialize(set)

    invalidCardsInSets.push(...unserializedSet.removeInvalidCards())

    return unserializedSet.serialize()
  })

  const nonEmptySets = cleanSets.filter(set => set.cards.length)

  const leftOverCards = placedCards.leftOverCards.concat(invalidCardsInSets)

  return {
    ...placedCards,
    serializedPropertySets: nonEmptySets,
    leftOverCards
  }
}

export function getSetIndexBySetId (
  setId: PropertySetId,
  sets: SerializedPropertySet[]
): number {
  return sets.findIndex(set => PropertySet.unserialize(set).getId() === setId)
}
