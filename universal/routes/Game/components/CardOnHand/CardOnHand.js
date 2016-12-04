import React, { PropTypes } from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'
import PlayCardButton from '../PlayCardButton'
import DiscardCardButton from '../DiscardCardButton'
import { isMoneyCard, canPlayCard } from '../../../../monopoly/monopoly'
import { PASS_GO } from '../../../../monopoly/cards'

export default class CardOnHand extends React.Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    card: PropTypes.string.isRequired,
    onPlaceCard: PropTypes.func.isRequired,
    onPlayCard: PropTypes.func.isRequired,
    onDrawCards: PropTypes.func.isRequired,
    onDiscardCard: PropTypes.func.isRequired,
    needsToDiscard: PropTypes.bool,
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
    if (card === PASS_GO) {
      this.props.onDrawCards(card)
    }
  }

  onDiscardCard = (e) => {
    e.stopPropagation()
    const { card } = this.props
    this.props.onDiscardCard(card)
  }

  render () {
    const {
      cards,
      card,
      needsToDiscard,
      isPlayerTurn
    } = this.props

    const cannotPlaceCard = !isPlayerTurn
    const cannotPlayCard = !isPlayerTurn || !canPlayCard(card, cards)

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
        {needsToDiscard &&
          <DiscardCardButton
            onClick={this.onDiscardCard}
          />
        }
      </div>
    )
  }
}

