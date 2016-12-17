/* @flow */
import {
  CARDS,
  PROPERTY_WILDCARD_TYPE,
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
import WildcardSet from './WildcardSet'

export const MAX_NUMBER_OF_ACTIONS = 3
export const NUMBER_OF_FULL_SETS_TO_WIN = 3

export function getCardObject (cardKeyOrCard: CardKeyOrCard): Card {
  return typeof cardKeyOrCard === 'string' ? CARDS[cardKeyOrCard] : cardKeyOrCard
}

export function totalValue (cards: CardKeyOrCard[]): number {
  return cards.reduce((previous, card) => previous + getCardObject(card).value, 0)
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

export function canPlayCard (cardKeyOrCard: CardKeyOrCard, placedCards: PlacedCards): boolean {
  const card = getCardObject(cardKeyOrCard)

  if (card.key === FORCED_DEAL && placedCards.properties.length) {
    return true
  }

  if (card.key !== FORCED_DEAL && isActionCard(card)) {
    return true
  }

  if (isRentCard(card)) {
    if (card.key === RENT_ALL_COLOUR && placedCards.properties.length) {
      return true
    }

    return placedCards.properties.some((c: CardKey): boolean => {
      const property = getCardObject(c)
      const forCards = card.forCards || []
      const propertyKey = property.treatAs ? property.treatAs : property.key
      return forCards.includes(propertyKey)
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

export function groupPropertiesIntoSets (cardKeys: CardKey[]): PropertySet[] {
  const sets: PropertySet[] = []
  const groups = new Map()
  const cardKeysWithoutWildcards = cardKeys.filter(c => c !== PROPERTY_WILDCARD)

  // Property groups (without wildcards)
  cardKeysWithoutWildcards.forEach((cardKey: CardKey): void => {
    const card = getCardObject(cardKey)
    let treatAs = card.key

    if (card.type === PROPERTY_WILDCARD_TYPE) {
      treatAs = card.treatAs
    }

    const group = groups.get(treatAs) || []
    group.push(cardKey)
    groups.set(treatAs, group)
  })

  // Property sets (without using wildcards)
  groups.forEach((cardKeys: CardKey[], treatAs: CardKey) => {
    const card = getCardObject(treatAs)
    const numberOfPropertiesRequired = card.needs
    let set = new PropertySet(treatAs, [], numberOfPropertiesRequired)
    sets.push(set)

    cardKeys.forEach(cardKey => {
      if (set.addProperty(cardKey)) {
        return
      }

      set = new PropertySet(treatAs, [], numberOfPropertiesRequired)
      sets.push(set)
      set.addProperty(cardKey)
    })
  })

  // Now, try to use the wildcards
  const wildcards = cardKeys.filter(c => c === PROPERTY_WILDCARD)
  const unusedWildcards = wildcards.filter((cardKey: CardKey) => {
    const used = sets.some((set: PropertySet) => {
      return set.addProperty(cardKey)
    })

    return !used
  })

  // Finally, a set for unused wildcards
  if (unusedWildcards.length) {
    sets.push(new WildcardSet(PROPERTY_WILDCARD, unusedWildcards))
  }

  return sets
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

export function cardPaymentAmount (cardKey: CardKey): number {
  return getCardObject(cardKey).paymentAmount
}

export function hasEnoughFullSetsToWin (propertySets: PropertySet[]) {
  const fullSetIdentifiersOfDifferentColors: string[] = propertySets.reduce((acc, set) => {
    if (!set.isFullSet() || acc.includes(set.identifier)) {
      return acc
    }

    return acc.concat([set.identifier])
  }, [])

  return fullSetIdentifiersOfDifferentColors.length >= NUMBER_OF_FULL_SETS_TO_WIN
}

export function totalAmount (cardKeys: CardKey[]): number {
  return cardKeys.reduce((acc, cardKey) => acc + getCardObject(cardKey).value, 0)
}
