/* @flow */
import * as monopoly from '../../../universal/monopoly/monopoly'
import * as sideEffectUtils from '../../side-effect-utils'
import PropertySet from '../../../universal/monopoly/PropertySet'
import type { PropertySetId } from '../../../universal/monopoly/PropertySet'

export function updatePayee (
  payeePlayer: Player,
  payer: Username,
  moneyCards: CardKey[],
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
): Promise<*> {
  const { payeeInfo } = payeePlayer

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
  moneyCards: CardKey[],
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
): Promise<*> {
  const { placedCards } = payerPlayer

  // Remove the money cards
  moneyCards.forEach(card => {
    const indexToRemove = placedCards.bank.findIndex(c => c === card)
    placedCards.bank.splice(indexToRemove, 1)
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

    if (!set.cards.length) {
      placedCards.serializedPropertySets.splice(index, 1)
    }
  })

  return payerPlayer.save()
}

function convertMapOfNonMoneyCards (
  mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
): [SerializedPropertySet[], CardKey[]] {
  const leftOverCards: CardKey[] = []
  const newSets: SerializedPropertySet[] = []

  mapOfNonMoneyCards.forEach((cards, setId) => {
    const sortedCards = PropertySet.sortCards(cards)
    const identifierKey = PropertySet.fromIdToIdentifierKey(setId)
    const propertySet = new PropertySet(monopoly.getCardObject(identifierKey), [])

    sortedCards.filter(card => !propertySet.addCard(card)).forEach(card => leftOverCards.push(card))
    propertySet.getCards().length && newSets.push(propertySet.serialize())
  })

  return [newSets, leftOverCards]
}
