import React, { PropTypes } from 'react'
import Card from './Card'

export default class CardPile extends React.Component {
  static propTypes = {
    faceUp: PropTypes.bool,
    cards: PropTypes.array
  }

  static defaultProps = {
    faceUp: false,
    cards: []
  }

  render () {
    const { cards, faceUp } = this.props

    const lastCard = cards.length && cards[cards.length - 1]

    return (
      <div style={{border: '1px solid black', width: 150, height: 230}}>
        {!!lastCard &&
          <Card card={lastCard} faceUp={faceUp} />
        }
        {!lastCard &&
          'No cards'
        }
      </div>
    )
  }
}

