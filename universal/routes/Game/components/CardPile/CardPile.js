/* @flow */
import React from 'react'
import Card from '../Card'

type Props = {
  faceUp?: boolean,
  size?: 'large' | 'small',
  cards: CardKey[]
}

export default class CardPile extends React.Component {
  props: Props

  static defaultProps = {
    cards: []
  }

  render () {
    const { cards, faceUp, size } = this.props

    const lastCard = cards.length ? cards[cards.length - 1] : null

    return (
      <Card card={lastCard} faceUp={faceUp} size={size} />
    )
  }
}
