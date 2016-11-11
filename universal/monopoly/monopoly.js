export function canRent (rentCard = { forCards }, cards = []) {
  return _.any(cards, card => forCards.includes(card)).length
}

export function canDealBreak (otherHands = []) {
  return _.any(otherHands, hand => hand.getFullSets().length).length
}

export function totalValue (cards = []) {
  return cards.reduce((previous, card) => previous + card.value, 0)
}
