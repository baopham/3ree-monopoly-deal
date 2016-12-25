/* @flow */
import PropertySet from '../../../../../universal/monopoly/PropertySet'
import {
  PROPERTY_WILDCARD,
  HOUSE,
  HOTEL
} from '../../../../../universal/monopoly/cards'

export type CardIndex = number
export type SerializedPropertySetIndex = number
export type MoneyCardTuple = [CardKey, CardIndex]
export type NonMoneyCardTuple = [CardKey, CardIndex, SerializedPropertySetIndex]

export function getSerializedPropertySetsFromMoneyCardTuples (
  tuples: NonMoneyCardTuple[],
  serializedPropertySets: SerializedPropertySet[]
): [SerializedPropertySet[], CardKey[]] {
  const mapOfCards: Map<SerializedPropertySetIndex, CardKey[]> = new Map()

  tuples.forEach(([card, cardIndex, serializedPropertySetIndex]) => {
    const cards = mapOfCards.get(serializedPropertySetIndex) || []
    cards.push(card)
    mapOfCards.set(serializedPropertySetIndex, cards)
  })

  let allLeftOverCards: CardKey[] = []
  let newSets: SerializedPropertySet[] = []

  mapOfCards.forEach(putIntoASet)

  return [newSets, allLeftOverCards]

  //////
  function putIntoASet (cards: CardKey[], setIndex: SerializedPropertySetIndex) {
    const originalSet = serializedPropertySets[setIndex]
    const propertySet = new PropertySet(originalSet.identifier, [])
    const sortedCards = sortCards(cards)

    allLeftOverCards = allLeftOverCards.concat(sortedCards.filter(c => !propertySet.addCard(c)))
    !propertySet.getCards.length && newSets.push(propertySet.serialize())
  }
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
  return a.length === b.length && a.some((item, index) => item === b[index])
}

function sortCards (cards: CardKey[]): CardKey[] {
  const sortedCards = cards.filter(c => c !== HOUSE && c !== HOTEL && c !== PROPERTY_WILDCARD)

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
