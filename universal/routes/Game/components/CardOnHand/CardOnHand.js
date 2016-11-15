import React, { PropTypes } from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'

export default class CardOnHand extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
    onPlaceCard: PropTypes.func.isRequired
  }

  onPlaceCard = (e) => {
    e.stopPropagation()
    console.log('test')
    this.props.onPlaceCard(this.props.card)
  }

  render () {
    const { card } = this.props

    return (
      <div>
        <Card card={card} faceUp />
        <PlaceCardButton onClick={this.onPlaceCard} />
      </div>
    )
  }
}

