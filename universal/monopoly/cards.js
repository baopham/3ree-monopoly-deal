// ------------------------------------
// Types
// ------------------------------------
export const ACTION_CARD_TYPE = Symbol()
export const PROPERTY_CARD_TYPE = Symbol()
export const PROPERTY_WILDCARD_TYPE = Symbol()
export const RENT_CARD_TYPE = Symbol()
export const MONEY_CARD_TYPE = Symbol()

// ------------------------------------
// Action cards
// ------------------------------------
export const HOUSE = Symbol()
export const HOTEL = Symbol()
export const DEAL_BREAKER = Symbol()
export const DOUBLE_RENT = Symbol()
export const FORCED_DEAL = Symbol()
export const SAY_NO = Symbol()
export const BIRTHDAY = Symbol()
export const DEBT_COLLECTOR = Symbol()
export const PASS_GO = Symbol()
export const SLY_DEAL = Symbol()

// ------------------------------------
// Property cards
// ------------------------------------
export const PROPERTY_BROWN = Symbol()
export const PROPERTY_BLUE = Symbol()
export const PROPERTY_GREEN = Symbol()
export const PROPERTY_LIGHT_BLUE = Symbol()
export const PROPERTY_ORANGE = Symbol()
export const PROPERTY_PINK = Symbol()
export const PROPERTY_BLACK = Symbol()
export const PROPERTY_RED = Symbol()
export const PROPERTY_YELLOW = Symbol()
export const PROPERTY_LIGHT_GREEN = Symbol()

export const PROPERTY_WILDCARD = Symbol()
export const PROPERTY_LIGHT_BLUE_OR_BROWN = Symbol()
export const PROPERTY_PINK_OR_ORANGE = Symbol()
export const PROPERTY_GREEN_OR_BLACK = Symbol()
export const PROPERTY_GREEN_OR_BLUE = Symbol()
export const PROPERTY_LIGHT_BLUE_OR_BLACK = Symbol()
export const PROPERTY_LIGHT_GREEN_OR_BLACK = Symbol()
export const PROPERTY_YELLOW_OR_RED = Symbol()

// ------------------------------------
// Rent cards
// ------------------------------------
export const RENT_ALL_COLOUR = Symbol()
export const RENT_BLUE_OR_GREEN = Symbol()
export const RENT_LIGHT_BLUE_OR_BROWN = Symbol()
export const RENT_ORANGE_OR_PINK = Symbol()
export const RENT_BLACK_OR_LIGHT_GREEN = Symbol()
export const RENT_RED_OR_YELLOW = Symbol()


// ------------------------------------
// Store
// ------------------------------------
export const MONEY_10M = Symbol()
export const MONEY_5M = Symbol()
export const MONEY_4M = Symbol()
export const MONEY_3M = Symbol()
export const MONEY_2M = Symbol()
export const MONEY_1M = Symbol()

export const CARDS = {
  [HOUSE]: {
    count: 3,
    value: 3,
    image: '/images/cards/house.png',
    type: ACTION_CARD_TYPE
  },

  [HOTEL]: {
    count: 3,
    value: 4,
    image: '/images/cards/hotel.png',
    type: ACTION_CARD_TYPE
  },

  [DEAL_BREAKER]: {
    count: 2,
    value: 4,
    image: '/images/cards/deal-breaker.png',
    type: ACTION_CARD_TYPE
  },

  [DEBT_COLLECTOR]: {
    count: 3,
    value: 3,
    image: '/images/cards/debt-collector.png',
    type: ACTION_CARD_TYPE
  },

  [DOUBLE_RENT]: {
    count: 2,
    value: 1,
    image: '/images/cards/double-rent.png',
    type: ACTION_CARD_TYPE
  },

  [FORCED_DEAL]: {
    count: 3,
    value: 3,
    image: '/images/cards/forced-deal.png',
    type: ACTION_CARD_TYPE
  },

  [BIRTHDAY]: {
    count: 3,
    value: 2,
    image: '/images/cards/birthday.png',
    type: ACTION_CARD_TYPE
  },

  [SAY_NO]: {
    count: 3,
    value: 4,
    image: '/images/cards/say-no.png',
    type: ACTION_CARD_TYPE
  },

  [PASS_GO]: {
    count: 10,
    value: 1,
    image: '/images/cards/pass-go.png',
    type: ACTION_CARD_TYPE
  },

  [SLY_DEAL]: {
    count: 3,
    value: 3,
    image: '/images/cards/sly-deal.png',
    type: ACTION_CARD_TYPE
  },

  [PROPERTY_BROWN]: {
    count: 2,
    value: 1,
    needs: 2,
    image: '/images/cards/property_brown.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_BLUE]: {
    count: 2,
    value: 4,
    needs: 2,
    image: '/images/cards/property-blue.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_GREEN]: {
    count: 3,
    value: 4,
    needs: 3,
    image: '/images/cards/property-green.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_LIGHT_BLUE]: {
    count: 3,
    value: 1,
    needs: 3,
    image: '/images/cards/property-light-blue.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_ORANGE]: {
    count: 3,
    value: 2,
    needs: 3,
    image: '/images/cards/property-orange.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_PINK]: {
    count: 3,
    value: 2,
    needs: 3,
    image: '/images/cards/property-pink.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_BLACK]: {
    count: 4,
    value: 2,
    needs: 4,
    image: '/images/cards/property-black.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_RED]: {
    count: 3,
    value: 3,
    needs: 3,
    image: '/images/cards/property-red.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_YELLOW]: {
    count: 3,
    value: 3,
    needs: 3,
    image: '/images/cards/property-yellow.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_LIGHT_GREEN]: {
    count: 2,
    value: 2,
    needs: 2,
    image: '/images/cards/property-light-green.png',
    type: PROPERTY_CARD_TYPE
  },

  [PROPERTY_WILDCARD]: {
    count: 2,
    value: 0,
    image: '/images/cards/property-wildcard.png',
    type: PROPERTY_WILDCARD_TYPE
  },

  [PROPERTY_GREEN_OR_BLUE]: {
    count: 1,
    value: 4,
    image: '/images/cards/property-green-or-blue.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_GREEN, PROPERTY_BLUE]
  },

  [PROPERTY_LIGHT_BLUE_OR_BROWN]: {
    count: 1,
    value: 1,
    image: '/images/cards/property-light-blue-or-brown.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_LIGHT_BLUE, PROPERTY_BROWN]
  },

  [PROPERTY_PINK_OR_ORANGE]: {
    count: 2,
    value: 2,
    image: '/images/cards/property-pink-or-orange.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_PINK, PROPERTY_ORANGE]
  },

  [PROPERTY_GREEN_OR_BLACK]: {
    count: 1,
    value: 4,
    image: '/images/cards/property-green-or-black.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_GREEN, PROPERTY_BLACK]
  },

  [PROPERTY_LIGHT_BLUE_OR_BLACK]: {
    count: 1,
    value: 4,
    image: '/images/cards/property-light-blue-or-black.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_LIGHT_BLUE, PROPERTY_BLACK]
  },

  [PROPERTY_LIGHT_GREEN_OR_BLACK]: {
    count: 1,
    value: 2,
    image: '/images/cards/property-light-green-or-black.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_LIGHT_GREEN, PROPERTY_BLACK]
  },

  [PROPERTY_YELLOW_OR_RED]: {
    count: 2,
    value: 3,
    image: '/images/cards/property-yellow-or-red.png',
    type: PROPERTY_WILDCARD_TYPE,
    forCards: [PROPERTY_YELLOW, PROPERTY_RED]
  },

  [RENT_ALL_COLOUR]: {
    count: 3,
    value: 3,
    image: '/images/cards/rent-all-colour.png',
    type: RENT_CARD_TYPE
  },

  [RENT_BLUE_OR_GREEN]: {
    count: 2,
    value: 1,
    image: '/images/cards/rent-blue-or-green.png',
    forCards: [PROPERTY_BLUE, PROPERTY_GREEN],
    type: RENT_CARD_TYPE
  },

  [RENT_LIGHT_BLUE_OR_BROWN]: {
    count: 2,
    value: 1,
    image: '/images/cards/rent-light-blue-or-brown.png',
    forCards: [PROPERTY_LIGHT_BLUE, PROPERTY_BROWN],
    type: RENT_CARD_TYPE
  },

  [RENT_ORANGE_OR_PINK]: {
    count: 2,
    value: 1,
    image: '/images/cards/rent-orange-or-pink.png',
    forCards: [PROPERTY_ORANGE, PROPERTY_PINK],
    type: RENT_CARD_TYPE
  },

  [RENT_BLACK_OR_LIGHT_GREEN]: {
    count: 2,
    value: 1,
    image: '/images/cards/rent-black-or-light-green.png',
    forCards: [PROPERTY_BLACK, PROPERTY_LIGHT_GREEN],
    type: RENT_CARD_TYPE
  },

  [RENT_RED_OR_YELLOW]: {
    count: 2,
    value: 1,
    image: '/images/cards/rent-red-or-yellow.png',
    forCards: [PROPERTY_RED, PROPERTY_YELLOW],
    type: RENT_CARD_TYPE
  },

  [MONEY_1M]: {
    count: 6,
    value: 1,
    image: '/images/cards/money-1m.png',
    type: MONEY_CARD_TYPE
  },

  [MONEY_2M]: {
    count: 5,
    value: 2,
    image: '/images/cards/money-2m.png',
    type: MONEY_CARD_TYPE
  },

  [MONEY_3M]: {
    count: 3,
    value: 3,
    image: '/images/cards/money-3m.png',
    type: MONEY_CARD_TYPE
  },

  [MONEY_4M]: {
    count: 3,
    value: 4,
    image: '/images/cards/money-4m.png',
    type: MONEY_CARD_TYPE
  },

  [MONEY_5M]: {
    count: 2,
    value: 5,
    image: '/images/cards/money-5m.png',
    type: MONEY_CARD_TYPE
  }
}

export function newDeck () {
  let cards = []

  Object.keys(CARDS).map(key => {
    const type = CARDS[key]

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
