import _ from 'lodash'
import {
  CARDS,
  MONEY_CARD_TYPE,
  ACTION_CARD_TYPE,
  RENT_CARD_TYPE,
  SAY_NO
} from './cards'

export function getCardObject (card) {
  return typeof card === 'string' ? CARDS[card] : card
}

export function totalValue (cards = []) {
  return cards.reduce((previous, card) => previous + getCardObject(card).value, 0)
}

export function isMoneyCard (card) {
  card = getCardObject(card)
  return card.type === MONEY_CARD_TYPE
}

export function isRentCard (card) {
  card = getCardObject(card)
  return card.type === RENT_CARD_TYPE
}

export function isActionCard(card) {
  card = getCardObject(card)
  return card.type === ACTION_CARD_TYPE
}

export function canPlayCard (card, cardsOnHand) {
  card = getCardObject(card)

  if (isActionCard(card)) {
    return true
  }

  if (isRentCard(card)) {
    return cardsOnHand.some((c) => {
      const forCards = card.forCards || []
      return forCards.includes(getCardObject(c).key)
    })
  }

  return false
}
