import React, { PropTypes } from 'react'

export default class CardsOnHand extends React.Component {
  static propTypes = {
    cards: PropTypes.array
  }

  static defaultProps = {
    cards: []
  }

  render () {
    const { cards } = this.props

    return (
      <div>
        {cards.map((map, i) => 
          <Card card={card} key={i} />
        )}
      </div>
    )
  }
}

