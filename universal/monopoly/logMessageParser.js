/* @flow */
import replace from 'string-replace-to-array'
import Card from '../components/Card'
import React from 'react'

const CARD_MARKER = 'card'
const cardRegex = new RegExp(`${CARD_MARKER}:(\\S+):${CARD_MARKER}`, 'g')

export function markCard (card: CardKey): string {
  return `${CARD_MARKER}:${card}:${CARD_MARKER}`
}

export function parseToJxs (message: string): React.Element<*> {
  const parts = replace(
    message,
    cardRegex,
    (fullMarker, card) => <Card card={card} size='xsmall' faceUp />
  )

  return (
    <span>{parts.map(part => part)}</span>
  )
}
