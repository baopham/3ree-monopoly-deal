/* @flow */
import React from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'
import PlayCardButton from '../PlayCardButton'
import DiscardCardButton from '../DiscardCardButton'
import FlipCardButton from '../FlipCardButton'
import PropertySetSelector from '../PropertySetSelector'
import {
  isMoneyCard,
  isActionCard,
  isRentCard,
  canPlayCard,
  canFlipCard
} from '../../../../monopoly/monopoly'
import { HOUSE, HOTEL, PROPERTY_WILDCARD } from '../../../../monopoly/cards'

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

type State = {
  selectingPropertySet: boolean
}

export default class CardOnHand extends React.Component {
  props: Props

  state: State

  state = {
    selectingPropertySet: false
  }

  onPlaceCard = (e: Event) => {
    e.stopPropagation()
    const { card } = this.props

    if ([HOUSE, HOTEL, PROPERTY_WILDCARD].includes(card)) {
      this.setState({ selectingPropertySet: true })
      return
    }

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

  onCancelSelectingPropertySet = () => {
    this.setState({
      selectingPropertySet: false
    })
  }

  onSelectPropertySet = (setToPutIn: SerializedPropertySet) => {
    const { card } = this.props
    const asMoney = false
    this.props.onPlaceCard(card, asMoney, setToPutIn)
    this.onCancelSelectingPropertySet()
  }

  render () {
    const {
      placedCards,
      card,
      needsToDiscard,
      isPlayerTurn
    } = this.props
    const { selectingPropertySet } = this.state

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
        {selectingPropertySet &&
          <PropertySetSelector
            header='Select a property set'
            subheader='Click to select a property set for your card'
            propertySets={placedCards.serializedPropertySets}
            onCancel={this.onCancelSelectingPropertySet}
            onSelect={this.onSelectPropertySet}
            fullSetOnly={[HOUSE, HOTEL].includes(card)}
          />
        }
      </div>
    )
  }
}
