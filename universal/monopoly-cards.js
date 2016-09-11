// TODO

export const HOUSE = 'HOUSE'
export const MONEY_10M = 'MONEY_10M'

export const CARD_TYPES = {
  [HOUSE]: {
    count: 3,
    value: 3,
    image: '/images/cards/action-card-house.png'
  },

  [MONEY_10M]: {
    count: 1,
    value: 10,
    image: '/images/cards/action-card-house.png'
  }
}

export function newDeck () {
  let cards = []

  Object.keys(CARD_TYPES).map(key => {
    const type = CARD_TYPES[key]

    cards = cards.concat(Array(type.count).fill(key))
  })

  return shuffle(cards)
}

export function shuffle (cards) {
  let j, x, i
  for (i = cards.length; i; i--) {
    j = Math.floor(Math.random() * i)
    x = cards[i - 1]
    cards[i - 1] = cards[j]
    cards[j] = x
  }

  return cards
}
