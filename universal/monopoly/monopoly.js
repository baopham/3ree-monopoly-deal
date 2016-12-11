/* @flow */
import {
  CARDS,
  MONEY_CARD_TYPE,
  ACTION_CARD_TYPE,
  RENT_CARD_TYPE,
  RENT_ALL_COLOUR,
  FORCED_DEAL
} from './cards'

export const MAX_NUMBER_OF_ACTIONS = 3

export function getCardObject (card: StringOrCard): Card {
  return typeof card === 'string' ? CARDS[card] : card
}

export function totalValue (cards: StringOrCard[]) {
  return cards.reduce((previous, card) => previous + getCardObject(card).value, 0)
}

export function isMoneyCard (card: StringOrCard) {
  card = getCardObject(card)
  return card.type === MONEY_CARD_TYPE
}

export function isRentCard (card: StringOrCard) {
  card = getCardObject(card)
  return card.type === RENT_CARD_TYPE
}

export function isActionCard (card: StringOrCard) {
  card = getCardObject(card)
  return card.type === ACTION_CARD_TYPE
}

export function canPlayCard (stringOrCard: StringOrCard, placedCards: PlacedCards) {
  const card = getCardObject(stringOrCard)

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

    return placedCards.properties.some((c: string) => {
      const property = getCardObject(c)
      const forCards = card.forCards || []
      const propertyKey = property.treatAs ? property.treatAs : property.key
      return forCards.includes(propertyKey)
    })
  }

  return false
}
