/* @flow */
import uuid from 'node-uuid'
import td from 'testdouble'
import { newDeck } from '../universal/monopoly/cards'

export function fakePlayer (override: Object = {}): Player {
  return td.object(Object.assign({
    id: uuid.v1(),
    gameId: uuid.v1(),
    username: uuid.v1(),
    actionCounter: 0,
    placedCards: {
      bank: [],
      serializedPropertySets: [],
      leftOverCards: []
    },
    payeeInfo: null,
    game: null,
    save: () => {},
    saveAll: () => {}
  }, override))
}

export function fakeGame (override: Object = {}): Game {
  return td.object(Object.assign({
    id: uuid.v1(),
    gameId: uuid.v1(),
    name: uuid.v1(),
    winner: null,
    discardedCards: [],
    availableCards: newDeck(),
    currentTurn: uuid.v1(),
    lastCardPlayedBy: null,
    players: [],
    createdAt: (new Date()).toString(),
    updatedAt: (new Date()).toString(),
    save: () => {},
    saveAll: () => {}
  }, override))
}

export function fakeCardRequest (override: Object = {}): CardRequest {
  return td.object(Object.assign({
    id: uuid.v1(),
    gameId: uuid.v1(),
    info: null,
    type: null,
    save: () => {},
    delete: () => {}
  }, override))
}
