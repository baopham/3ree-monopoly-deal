import React, { PropTypes } from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'
import PlayCardButton from '../PlayCardButton'
import { isMoneyCard, canPlayCard } from '../../../../monopoly/monopoly'

export default class CardOnHand extends React.Component {
  static propTypes = {
    card: PropTypes.string.isRequired,
    onPlaceCard: PropTypes.func.isRequired,
    onPlayCard: PropTypes.func.isRequired,
    isPlayerTurn: PropTypes.bool
  }

  onPlaceCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onPlaceCard(card, isMoneyCard(card))
  }

  onPlayCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onPlayCard(card)
  }

  render () {
    const { card, isPlayerTurn } = this.props
    const cannotPlaceCard = !isPlayerTurn
    const cannotPlayCard = !isPlayerTurn || !canPlayCard(card)

    return (
      <div>
        <Card card={card} faceUp />
        <PlaceCardButton
          disabled={cannotPlaceCard}
          onClick={this.onPlaceCard}
        />
        <PlayCardButton
          disabled={cannotPlayCard}
          onClick={this.onPlayCard}
        />
      </div>
    )
  }
}

