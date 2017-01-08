/* @flow */
import React from 'react'
import Card from '../Card'
import PlaceCardButton from '../PlaceCardButton'
import PlayCardButton from '../PlayCardButton'
import DiscardCardButton from '../DiscardCardButton'
import FlipCardButton from '../FlipCardButton'
import MoneySignButton from '../MoneySignButton'
import PropertySetSelector from '../PropertySetSelector'
import {
  isMoneyCard,
  isActionCard,
  isRentCard,
  canPlayCard,
  canFlipCard,
  cardCanBeMoney
} from '../../../../monopoly/monopoly'
import PropertySetClass from '../../../../monopoly/PropertySet'
import { HOUSE, HOTEL, PROPERTY_WILDCARD } from '../../../../monopoly/cards'

type Props = {
  placedCards: PlacedCards,
  card: CardKey,
  needsToDiscard: boolean,
  isPlayerTurn: boolean,
  onPlaceCard: (card: CardKey, boolean) => void,
  onPlayCard: (card: CardKey) => void,
  onDiscardCard: (card: CardKey) => void,
  onFlipCard: (card: CardKey) => void
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
    const { card } = this.props

    if ([HOUSE, HOTEL, PROPERTY_WILDCARD].includes(card)) {
      this.setState({ selectingPropertySet: true })
      return
    }

    this.props.onPlaceCard(card, this.cannotPutIntoPropertyArea(card))
  }

  onPlaceCardAsMoney = (e: Event) => {
    const { card } = this.props
    this.props.onPlaceCard(card, true)
  }

  onPlayCard = (e: Event) => {
    const { card } = this.props
    this.props.onPlayCard(card)
  }

  onDiscardCard = (e: Event) => {
    const { card } = this.props
    this.props.onDiscardCard(card)
  }

  onFlipCard = (e: Event) => {
    const { card } = this.props
    this.props.onFlipCard(card)
  }

  onCancelSelectingPropertySet = () => {
    this.setState({ selectingPropertySet: false })
  }

  onSelectPropertySet = (setToPutIn: PropertySetClass) => {
    const { card } = this.props
    const asMoney = false
    this.props.onPlaceCard(card, asMoney, setToPutIn.serialize())
    this.onCancelSelectingPropertySet()
  }

  cannotPutIntoPropertyArea (card: CardKey) {
    return isMoneyCard(card) || isActionCard(card) || isRentCard(card)
  }

  renderPropertySetSelector () {
    const { placedCards, card } = this.props

    let propertySetsToSelect: PropertySetClass[] = placedCards.serializedPropertySets
      .map(PropertySetClass.unserialize)
      .filter(s => s.canAddCard(card))

    return (
      <PropertySetSelector
        header='Select a property set'
        subheader={
          propertySetsToSelect.length
            ? 'Click to select a property set for your card'
            : `No eligible sets for ${card}`
        }
        propertySets={propertySetsToSelect}
        onCancel={this.onCancelSelectingPropertySet}
        onSelect={this.onSelectPropertySet}
      />
    )
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
    const canBeMoney = cardCanBeMoney(card)
    const canOnlyBeMoney = this.cannotPutIntoPropertyArea(card)

    return (
      <div>
        <Card card={card} faceUp />
        {!canOnlyBeMoney &&
          <PlaceCardButton
            disabled={cannotPlaceCard}
            onClick={this.onPlaceCard}
          />
        }
        {canBeMoney &&
          <MoneySignButton
            disabled={cannotPlaceCard}
            onClick={this.onPlaceCardAsMoney}
          />
        }
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
          this.renderPropertySetSelector()
        }
      </div>
    )
  }
}
