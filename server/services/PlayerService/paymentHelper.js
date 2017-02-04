/* @flow */
import { DOUBLE_RENT, getCardObject } from '../../../universal/monopoly/cards'
import * as monopoly from '../../../universal/monopoly/monopoly'
import * as sideEffectUtils from '../../side-effect-utils'
import * as propertySetUtils from '../../property-set-utils'
import PropertySet from '../../../universal/monopoly/PropertySet'
import type { PropertySetId } from '../../../universal/monopoly/PropertySet'

export function updatePayee (
  payeePlayer: Player,
  payer: Username,
  bankCards: CardKey[],
  leftOverCards: CardKey[],
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
): Promise<*> {
  const { payeeInfo } = payeePlayer

  // Left over cards should just be HOUSE, HOTEL.
  const moneyCards = bankCards.concat(leftOverCards)

  if (!payeeInfo.payers || !payeeInfo.payers.includes(payer)) {
    return Promise.reject(`${payer} does not owe anything`)
  }

  // Since payer is paying their due, we remove them from the list.
  payeePlayer.payeeInfo.payers = payeeInfo.payers.filter(p => p !== payer)

  // If we don't have any payers left, reset payeeInfo.
  if (!payeePlayer.payeeInfo.payers.length) {
    payeePlayer.payeeInfo.amount = 0
    payeePlayer.payeeInfo.cardPlayed = null
  }

  // Merge the property sets.
  const { placedCards } = payeePlayer
  const [paymentSerializedSets, nonMoneyLeftOverCards] = convertMapOfNonMoneyCards(mapOfNonMoneyCards)

  const leftOverNonPropertyCards = monopoly.mergeSerializedPropertySets(
    placedCards.serializedPropertySets,
    paymentSerializedSets
  )

  // Put money cards into the bank.
  placedCards.bank = placedCards.bank
    .concat(moneyCards)
    .concat(nonMoneyLeftOverCards)
    .concat(leftOverNonPropertyCards)

  return payeePlayer.save()
}

export function updatePayer (
  payerPlayer: Player,
  bankCards: CardKey[],
  leftOverCards: CardKey[],
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
): Promise<*> {
  const { placedCards } = payerPlayer

  // Remove the money cards
  bankCards.forEach(card => {
    sideEffectUtils.removeFirstInstanceFromArray(card, placedCards.bank)
  })

  // Remove the left over cards
  leftOverCards.forEach(card => {
    sideEffectUtils.removeFirstInstanceFromArray(card, placedCards.leftOverCards)
  })

  // Remove the property sets, if there are any to remove.
  if (!mapOfNonMoneyCards.size) {
    return payerPlayer.save()
  }

  placedCards.serializedPropertySets.forEach((set, index) => {
    const thisPropertySet = PropertySet.unserialize(set)
    const cardsToPay = mapOfNonMoneyCards.get(thisPropertySet.getId())

    if (!cardsToPay) {
      return
    }

    cardsToPay.forEach(cardToRemove => sideEffectUtils.removeFirstInstanceFromArray(cardToRemove, set.cards))
  })

  payerPlayer.placedCards = propertySetUtils.cleanUpPlacedCards(placedCards)

  return payerPlayer.save()
}

export function getCardPaymentAmount (game: Game, player: Player, cardKey: CardKey): number {
  const basePaymentAmount = monopoly.getCardPaymentAmount(cardKey, player.placedCards.serializedPropertySets)

  const hasPlayedDoubleRent =
    monopoly.isRentCard(cardKey) &&
    game.discardedCards[game.discardedCards.length - 1] === DOUBLE_RENT &&
    game.lastCardPlayedBy === player.username

  if (hasPlayedDoubleRent) {
    const [secondToLastCard, lastCard] = game.discardedCards.slice(Math.max(game.discardedCards.length - 2, 0))

    const hasPlayedTwoDoubleRentInARow =
      secondToLastCard === DOUBLE_RENT &&
      lastCard === DOUBLE_RENT &&
      player.actionCounter === 2

    return hasPlayedTwoDoubleRentInARow ? basePaymentAmount * 4 : basePaymentAmount * 2
  }

  return basePaymentAmount
}

function convertMapOfNonMoneyCards (
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
): [SerializedPropertySet[], CardKey[]] {
  const leftOverCards: CardKey[] = []
  const newSets: SerializedPropertySet[] = []

  mapOfNonMoneyCards.forEach((cards, setId) => {
    const sortedCards = PropertySet.sortCards(cards)
    const identifierKey = PropertySet.fromIdToIdentifierKey(setId)
    const propertySet = new PropertySet(getCardObject(identifierKey), [])

    sortedCards.filter(card => !propertySet.addCard(card)).forEach(card => leftOverCards.push(card))
    propertySet.getCards().length && newSets.push(propertySet.serialize())
  })

  return [newSets, leftOverCards]
}
