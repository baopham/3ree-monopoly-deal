/* @flow */
import React from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'
import PlayCardButton from '../PlayCardButton'
import DiscardCardButton from '../DiscardCardButton'
import FlipCardButton from '../FlipCardButton'
import {
  isMoneyCard,
  isActionCard,
  isRentCard,
  canPlayCard,
  canFlipCard
} from '../../../../monopoly/monopoly'

type Props = {
  placedCards: PlacedCards,
  card: CardKey,
  onPlaceCard: (card: CardKey, boolean) => void,
  onPlayCard: (card: CardKey) => void,
  onDrawCards: () => void,
  onDiscardCard: (card: CardKey) => void,
  onFlipCard: (card: CardKey) => void,
  needsToDiscard: boolean,
  isPlayerTurn: boolean
}

export default class CardOnHand extends React.Component {
  props: Props

  onPlaceCard = (e: Event) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onPlaceCard(card, isMoneyCard(card) || isActionCard(card) || isRentCard(card))
  }

  onPlayCard = (e: Event) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onPlayCard(card)
  }

  onDiscardCard = (e: Event) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onDiscardCard(card)
  }

  onFlipCard = (e: Event) => {
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
