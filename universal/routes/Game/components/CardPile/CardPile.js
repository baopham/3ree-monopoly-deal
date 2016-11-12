import React, { PropTypes } from 'react'
import Card from '../Card'

export default class CardPile extends React.Component {
  static propTypes = {
    faceUp: PropTypes.bool,
    size: PropTypes.string,
    cards: PropTypes.array
  }

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

