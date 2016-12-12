import React, { PropTypes } from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'
import PlayCardButton from '../PlayCardButton'
import DiscardCardButton from '../DiscardCardButton'
import FlipCardButton from '../FlipCardButton'
import { isMoneyCard, isActionCard, canPlayCard, canFlipCard } from '../../../../monopoly/monopoly'

export default class CardOnHand extends React.Component {
  static propTypes = {
    placedCards: PropTypes.object.isRequired,
    card: PropTypes.string.isRequired,
    onPlaceCard: PropTypes.func.isRequired,
    onPlayCard: PropTypes.func.isRequired,
    onDrawCards: PropTypes.func.isRequired,
    onDiscardCard: PropTypes.func.isRequired,
    onFlipCard: PropTypes.func.isRequired,
    needsToDiscard: PropTypes.bool,
    isPlayerTurn: PropTypes.bool
  }

  onPlaceCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onPlaceCard(card, isMoneyCard(card) || isActionCard(card))
  }

  onPlayCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onPlayCard(card)
  }

  onDiscardCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onDiscardCard(card)
  }

  onFlipCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onFlipCard(card)
  }

  render () {
    const {
      placedCards,
      card,
      needsToDiscard,
      isPlayerTurn
    } = this.props

    const cannotPlaceCard = !isPlayerTurn
    const cannotPlayCard = !isPlayerTurn || !canPlayCard(card, placedCards)
    const showFlipCardButton = canFlipCard(card)

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
        {showFlipCardButton &&
          <FlipCardButton
            onClick={this.onFlipCard}
          />
        }
        {needsToDiscard &&
          <DiscardCardButton
            onClick={this.onDiscardCard}
          />
        }
      </div>
    )
  }
}

