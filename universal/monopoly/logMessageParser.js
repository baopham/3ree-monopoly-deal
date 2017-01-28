/* @flow */
import React from 'react'
import replace from 'string-replace-to-array'
import Card from '../components/Card'
import PropertySet from '../monopoly/PropertySet'
import type { PropertySetId } from '../monopoly/PropertySet'

const CARD_MARKER = 'card'
const cardRegex = new RegExp(`${CARD_MARKER}:(\\S+):${CARD_MARKER}`, 'g')

export function markCard (card: CardKey): string {
  return `${CARD_MARKER}:${card}:${CARD_MARKER}`
}

export function markSet (setId: PropertySetId): string {
  const set = PropertySet.convertIdToPropertySet(setId)
  return set.getCards().map(markCard).join(' ')
}

export function parseToJxs (message: string): React.Element<*> {
  const parts = replace(
    message,
    cardRegex,
    (fullMarker, card) => <Card card={card} size='xsmall' faceUp />
  )

  return (
    <span>
      {parts.map((part, index) =>
        <span key={index}>{part}</span>
      )}
    </span>
  )
}
