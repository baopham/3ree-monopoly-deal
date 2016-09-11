import React, { PropTypes } from 'react'
import Card from './Card'

export default class Cards extends React.Component {
  static propTypes = {
    cards: PropTypes.array.isRequired
  }

  render () {
    const { cards } = this.props

    return (
      <div>
        {cards.map((card, i) =>
          <Card card={card} key={i} />
        )}
      </div>
    )
  }
}

