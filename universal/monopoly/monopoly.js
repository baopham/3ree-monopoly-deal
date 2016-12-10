/* @flow */
import {
  CARDS,
  MONEY_CARD_TYPE,
  ACTION_CARD_TYPE,
  RENT_CARD_TYPE
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

  if (isActionCard(card)) {
    return true
  }

  if (isRentCard(card)) {
    return placedCards.properties.some((c: string) => {
      const forCards = card.forCards || []
      return forCards.includes(getCardObject(c).key)
    })
  }

  return false
}
