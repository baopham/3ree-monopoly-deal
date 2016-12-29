/* @flow */
import React from 'react'
import PropertySet from '../PropertySet'
import FlipCardButton from '../FlipCardButton'
import MoveCardButton from '../MoveCardButton'
import PropertySetSelector from '../PropertySetSelector'
import * as monopoly from '../../../../monopoly/monopoly'
import {
  HOUSE,
  HOTEL,
  PROPERTY_WILDCARD
} from '../../../../monopoly/cards'
import PropertySetType from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  propertySets: PropertySetType[],
  immutable: boolean,
  onWinning: () => void,
  onFlipCard: (card: CardKey, propertySetId: PropertySetId) => void,
  onMoveCard: (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) => void
}

type State = {
  cardToMove: ?CardKey,
  fromSetId: ?string,
  movingToAnotherSet: boolean,
  setsForMovingCardTo: PropertySetType[]
}

export default class PlacedPropertySet extends React.Component {
  props: Props

  state: State

  hasWon: boolean

  constructor (props: Props) {
    super(props)

    this.state = {
      cardToMove: null,
      fromSetId: null,
      movingToAnotherSet: false,
      setsForMovingCardTo: []
    }
    this.hasWon = monopoly.hasEnoughFullSetsToWin(props.propertySets)
    this.hasWon && this.props.onWinning()
  }

  shouldComponentUpdate () {
    return !this.hasWon
  }

  componentWillUpdate (nextProps: Props) {
    this.hasWon = monopoly.hasEnoughFullSetsToWin(nextProps.propertySets)
    this.hasWon && this.props.onWinning()
  }

  componentWillUnmount () {
    this.hasWon = false
  }

  renderCardFooter = (card: CardKey, setId: PropertySetId) => {
    const { onFlipCard, immutable } = this.props

    return (
      <div>
        {!immutable &&
          <div>
            {monopoly.canFlipCard(card) &&
              <FlipCardButton onClick={() => onFlipCard(card, setId)} />
            }
            <MoveCardButton onClick={() => this.movingToAnotherSet(card, setId)} />
          </div>
        }
      </div>
    )
  }

  movingToAnotherSet = (cardToMove: CardKey, fromSetId: PropertySetId) => {
    const { propertySets } = this.props

    this.setState({
      cardToMove,
      fromSetId,
      movingToAnotherSet: true,
      setsForMovingCardTo: propertySets.filter(s => s.canAddCard(cardToMove) && s.getId() !== fromSetId)
    })
  }

  cancelMovingToAnotherSet = () => {
    this.setState({
      cardToMove: null,
      fromSetId: null,
      movingToAnotherSet: false,
      setsForMovingCardTo: []
    })
  }

  onSelectASetForMovingCardTo = (selectedSet: PropertySetType) => {
    const { onMoveCard } = this.props
    const { cardToMove, fromSetId } = this.state

    if (!cardToMove || !fromSetId) {
      return
    }

    onMoveCard(cardToMove, fromSetId, selectedSet.getId())

    this.cancelMovingToAnotherSet()
  }

  render () {
    const { propertySets } = this.props
    const { movingToAnotherSet, setsForMovingCardTo } = this.state

    return (
      <ul className='list-inline'>
        {propertySets.map((set, setIndex) =>
          <li key={setIndex}>
            <PropertySet
              propertySet={set}
              renderCardFooter={card => this.renderCardFooter(card, set.getId())}
            />
          </li>
        )}
        {movingToAnotherSet &&
          <PropertySetSelector
            header='Select a property set'
            subheader={
              setsForMovingCardTo.length
              ? 'Click to select where to move the card to'
              : 'Cannot move this card'
            }
            propertySets={setsForMovingCardTo}
            onSelect={this.onSelectASetForMovingCardTo}
            onCancel={this.cancelMovingToAnotherSet}
          />
        }
      </ul>
    )
  }
}
