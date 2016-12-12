/* @flow */
import {
  CARDS,
  PROPERTY_WILDCARD_TYPE,
  MONEY_CARD_TYPE,
  ACTION_CARD_TYPE,
  RENT_CARD_TYPE,
  RENT_ALL_COLOUR,
  FORCED_DEAL
} from './cards'
import PropertySet from './PropertySet'

export const MAX_NUMBER_OF_ACTIONS = 3

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

  cardKeys.forEach((cardKey: CardKey): void => {
    const card = getCardObject(cardKey)
    let treatAs = card.key

    if (card.type === PROPERTY_WILDCARD_TYPE) {
      treatAs = card.treatAs

      if (!treatAs) {
        // TODO: handle wildcard
        return
      }
    }

    const group = groups.get(treatAs) || []
    group.push(cardKey)
    groups.set(treatAs, group)
  })

  groups.forEach((cardKeys: CardKey[], treatAs: CardKey) => {
    const card = getCardObject(treatAs)
    const numberOfPropertiesRequired = card.needs
    let set = new PropertySet([], numberOfPropertiesRequired)
    sets.push(set)

    cardKeys.forEach(cardKey => {
      if (set.addProperty(cardKey)) {
        return
      }

      set = new PropertySet([], numberOfPropertiesRequired)
      sets.push(set)
      set.addProperty(cardKey)
    })
  })

  return sets
}
