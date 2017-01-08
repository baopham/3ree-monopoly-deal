/* @flow */
import {
  CARDS,
  SAY_NO,
  PROPERTY_CARD_TYPE,
  PROPERTY_WILDCARD_TYPE,
  PROPERTY_WILDCARD_ALL_COLOUR_TYPE,
  PROPERTY_WILDCARD,
  MONEY_CARD_TYPE,
  ACTION_CARD_TYPE,
  RENT_CARD_TYPE,
  RENT_ALL_COLOUR,
  FORCED_DEAL,
  BIRTHDAY,
  DEBT_COLLECTOR
} from './cards'
import PropertySet from './PropertySet'

export const MAX_NUMBER_OF_ACTIONS = 3
export const NUMBER_OF_FULL_SETS_TO_WIN = 3

export function getCardObject (cardKeyOrCard: CardKeyOrCard): Card {
  return typeof cardKeyOrCard === 'string' ? CARDS[cardKeyOrCard] : cardKeyOrCard
}

export function getPropertySetIdentifier (cardKeyOrCard: CardKeyOrCard): Card {
  return getCardObject(getCardObject(cardKeyOrCard).treatAs)
}

export function isMoneyCard (card: CardKeyOrCard): boolean {
  card = getCardObject(card)
  return card.type === MONEY_CARD_TYPE
}

export function isRentCard (card: CardKeyOrCard): boolean {
  card = getCardObject(card)
  return card.type === RENT_CARD_TYPE
}

export function isActionCard (card: CardKeyOrCard): boolean {
  card = getCardObject(card)
  return card.type === ACTION_CARD_TYPE
}

export function isPropertyCard (card: CardKeyOrCard): boolean {
  card = getCardObject(card)
  return card.type === PROPERTY_CARD_TYPE ||
    card.type === PROPERTY_WILDCARD_ALL_COLOUR_TYPE ||
    card.type === PROPERTY_WILDCARD_TYPE
}

export function canBePutIntoANewSet (card: CardKeyOrCard): boolean {
  return isPropertyCard(card) && card !== PROPERTY_WILDCARD
}

export function cardCanBeMoney (card: CardKeyOrCard): boolean {
  card = getCardObject(card)
  return card.value > 0
}

export function canPlayCard (cardKeyOrCard: CardKeyOrCard, placedCards: PlacedCards): boolean {
  const card = getCardObject(cardKeyOrCard)

  if (card.key === SAY_NO) {
    return false
  }

  if (card.key === FORCED_DEAL && placedCards.serializedPropertySets.length) {
    return true
  }

  if (card.key !== FORCED_DEAL && isActionCard(card)) {
    return true
  }

  if (isRentCard(card)) {
    if (card.key === RENT_ALL_COLOUR && placedCards.serializedPropertySets.length) {
      return true
    }

    const properties = placedCards.serializedPropertySets
      .map(PropertySet.unserialize)
      .reduce((acc, set: PropertySet) => acc.concat(set.getProperties()), [])

    return properties.some((c: CardKey): boolean => {
      const property = getCardObject(c)
      const forCards = card.forCards || []
      return forCards.includes(property.treatAs)
    })
  }

  return false
}

export function canFlipCard (cardKeyOrCard: CardKeyOrCard): boolean {
  const card = getCardObject(cardKeyOrCard)

  return card.type === PROPERTY_WILDCARD_TYPE
}

export function flipCard (cardKeyOrCard: CardKeyOrCard): CardKey {
  return getCardObject(cardKeyOrCard).flipTo
}

export function getCardImageSrc (cardKeyOrCard: CardKeyOrCard): string {
  return getCardObject(cardKeyOrCard).image
}

export function cardRequiresPayment (cardKey: CardKey) {
  const card = getCardObject(cardKey)

  if (isRentCard(card)) {
    return true
  }

  if (isActionCard(card)) {
    return cardKey === BIRTHDAY || cardKey === DEBT_COLLECTOR
  }

  return false
}

/**
 * e.g. DEBT_COLLECTOR -> 5M, RENT -> xx depending on what cards are available
 */
export function getCardPaymentAmount (cardKey: CardKey, serializedPropertySets: SerializedPropertySet[]): number {
  const card = getCardObject(cardKey)

  if (!isRentCard(card)) {
    return card.paymentAmount
  }

  const maxRentableAmount = serializedPropertySets.reduce((acc, item) => {
    const set = PropertySet.unserialize(item)

    if (set.isRentable(card)) {
      const rentAmount = set.getRentAmount()
      return rentAmount > acc ? rentAmount : acc
    }

    return acc
  }, 0)

  return maxRentableAmount
}

export function hasEnoughFullSetsToWin (propertySets: PropertySet[]) {
  const fullSetIdentifiersOfDifferentColors: string[] = propertySets.reduce((acc, set) => {
    if (!set.isFullSet() || acc.includes(set.identifier)) {
      return acc
    }

    return acc.concat([set.identifier.key])
  }, [])

  return fullSetIdentifiersOfDifferentColors.length >= NUMBER_OF_FULL_SETS_TO_WIN
}

export function getTotalMoneyFromCards (cardKeys: CardKey[]): number {
  return cardKeys.reduce((acc, cardKey) => acc + getCardObject(cardKey).value, 0)
}

export function getTotalMoneyFromPlacedCards (placedCards: PlacedCards): number {
  return getTotalMoneyFromCards(placedCards.bank) +
    getTotalMoneyFromCards(flattenSerializedPropertySetCards(placedCards.serializedPropertySets))
}

/**
 * Side effect on serializedPropertySets
 * Return boolean: if false, no set to put in, if true, the card has been put in a set
 */
export function putInTheFirstNonFullSet (cardKey: CardKey, serializedPropertySets: SerializedPropertySet[]): boolean {
  const card = getCardObject(cardKey)

  const hasBeenPlaced = serializedPropertySets
    .some((set, index) => {
      if (set.identifier.key !== card.treatAs || PropertySet.unserialize(set).isFullSet()) {
        return false
      }

      set.cards.push(cardKey)
      return true
    })

  return hasBeenPlaced
}

/**
 * Side effect on `mine`
 * Return any left over cards that cannot be used to form property sets.
 */
export function mergeSerializedPropertySets (
  mine: SerializedPropertySet[],
  theirs: SerializedPropertySet[]
): CardKey[] {
  const allLeftOverCards = []

  // First get all of my non full sets
  // Keeping references to ensure the order staying the same
  const nonFullSerializedSets: Map<CardKey, SerializedPropertySet> = new Map()

  mine.forEach((item) => {
    if (PropertySet.unserialize(item).isFullSet()) {
      return
    }

    nonFullSerializedSets.set(item.identifier.key, item)
  })

  // Next, merging
  theirs.forEach(merge)

  // Finally, deal with the left over cards
  // TODO: when will this happen?
  return handleLeftOverCards()

  //////
  function merge (other: SerializedPropertySet) {
    const otherPropertySet = PropertySet.unserialize(other)

    if (otherPropertySet.isFullSet()) {
      mine.push(otherPropertySet.serialize())
      return
    }

    let serializedSetToMerge = nonFullSerializedSets.get(other.identifier.key)
    const updateExistingSet = !!serializedSetToMerge

    if (!serializedSetToMerge) {
      serializedSetToMerge = { identifier: other.identifier, cards: [] }
    }

    const setToMerge = PropertySet.unserialize(serializedSetToMerge)

    const leftOverCards = setToMerge.mergeWith(otherPropertySet)

    // Update in place
    updateExistingSet && Object.assign(serializedSetToMerge, setToMerge.serialize())

    // Or push a new one
    !updateExistingSet && setToMerge.getCards().length && mine.push(serializedSetToMerge)

    leftOverCards && allLeftOverCards.push(...leftOverCards)
  }

  function handleLeftOverCards (): CardKey[] {
    if (!allLeftOverCards.length) {
      return []
    }

    const leftOverProperties = allLeftOverCards.filter(c => isPropertyCard(c))
    const leftOverNonProperties = allLeftOverCards.filter(c => !isPropertyCard(c))

    const [newPropertySets, unusedWildcards] = groupPropertiesIntoSets(leftOverProperties)

    mine.push(...newPropertySets.map(set => set.serialize()))

    leftOverNonProperties.forEach((c, index) => {
      const used = newPropertySets.some(set => set.addCard(c))
      used && leftOverNonProperties.splice(index, 1)
    })

    return leftOverNonProperties.concat(unusedWildcards)
  }
}

function groupPropertiesIntoSets (cardKeys: CardKey[]): [PropertySet[], CardKey[]] {
  const sets: PropertySet[] = []
  const groups = new Map()
  const cardKeysWithoutWildcards = cardKeys.filter(c => c !== PROPERTY_WILDCARD)

  // Property groups (without wildcards)
  cardKeysWithoutWildcards.forEach((cardKey: CardKey): void => {
    const card = getCardObject(cardKey)
    let treatAs = card.treatAs

    const group = groups.get(treatAs) || []
    group.push(cardKey)
    groups.set(treatAs, group)
  })

  // Property sets (without using wildcards)
  groups.forEach((cardKeys: CardKey[], treatAs: CardKey) => {
    const treatAsCard = getCardObject(treatAs)
    let set = new PropertySet(treatAsCard, [])
    sets.push(set)

    cardKeys.forEach(cardKey => {
      if (set.addCard(cardKey)) {
        return
      }

      set = new PropertySet(treatAsCard, [])
      sets.push(set)
      set.addCard(cardKey)
    })
  })

  // Now, try to use the wildcards
  const wildcards = cardKeys.filter(c => c === PROPERTY_WILDCARD)
  const unusedWildcards = wildcards.filter((cardKey: CardKey) => {
    const used = sets.some((set: PropertySet) => {
      return set.addCard(cardKey)
    })

    return !used
  })

  return [sets, unusedWildcards]
}

function flattenSerializedPropertySetCards (serializedPropertySets: SerializedPropertySet[]): CardKey[] {
  return serializedPropertySets.reduce((acc, item) => acc.concat(item.cards), [])
}
