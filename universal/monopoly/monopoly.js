import _ from 'lodash'
import {
  CARDS,
  MONEY_CARD_TYPE,
  SAY_NO
} from './cards'

export function canRent (rentCard = { forCards }, cards = []) {
  return _.any(cards, card => forCards.includes(card)).length
}

export function canDealBreak (otherHands = []) {
  return _.any(otherHands, hand => hand.getFullSets().length).length
}

export function totalValue (cards = []) {
  return cards.reduce((previous, card) => previous + card.value, 0)
}

export function canSayNo (cards = []) {
  return _.any(cards, card => card === CARDS[SAY_NO])
}

export function isMoneyCard (card) {
  return card.type === MONEY_CARD_TYPE
}
