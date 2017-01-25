/* @flow */
import React from 'react'
import Card from '../../../../components/Card'
import FlipCardButton from '../FlipCardButton'
import MoveCardButton from '../MoveCardButton'
import PropertySetSelectorForm from '../PropertySetSelectorForm'
import * as monopoly from '../../../../monopoly/monopoly'
import PropertySetClass from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  propertySets: PropertySetClass[],
  leftOverCards: CardKey[],
  immutable: boolean,
  onFlipCard: (card: CardKey) => void,
  onMoveCard: (card: CardKey, toSetId: PropertySetId) => void
}

type State = {
  cardToMove: CardKey,
  movingToASet: boolean,
  setsForMovingCardTo: PropertySetClass[]
}

export default class PlacedLeftOverCards extends React.Component {
  props: Props

  state: State

  state = {
    cardToMove: undefined,
    movingToASet: false,
    setsForMovingCardTo: []
  }

  renderCardFooter = (card: CardKey) => {
    const { onFlipCard, immutable } = this.props

    return (
      <div>
        {!immutable &&
          <div>
            {monopoly.canFlipCard(card) &&
              <FlipCardButton onClick={() => onFlipCard(card)} />
            }
            <MoveCardButton onClick={() => this.movingToASet(card)} />
          </div>
        }
      </div>
    )
  }

  movingToASet = (cardToMove: CardKey) => {
    const { propertySets } = this.props

    this.setState({
      cardToMove,
      movingToASet: true,
      setsForMovingCardTo: propertySets.filter(s => s.canAddCard(cardToMove))
    })
  }

  cancelMovingToAnotherSet = () => {
    this.setState({
      cardToMove: undefined,
      movingToASet: false,
      setsForMovingCardTo: []
    })
  }

  onSelectASetForMovingCardTo = (selectedSet: PropertySetClass) => {
    const { onMoveCard } = this.props
    const { cardToMove } = this.state

    if (!cardToMove) {
      return
    }

    onMoveCard(cardToMove, selectedSet.getId())

    this.cancelMovingToAnotherSet()
  }

  render () {
    const { leftOverCards } = this.props
    const { movingToASet, setsForMovingCardTo } = this.state

    return (
      <ul className='list-inline'>
        {leftOverCards.map((card, index) =>
          <li key={index}>
            <Card card={card} size='small' faceUp />
            {this.renderCardFooter(card)}
          </li>
        )}
        {movingToASet &&
          <PropertySetSelectorForm
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
