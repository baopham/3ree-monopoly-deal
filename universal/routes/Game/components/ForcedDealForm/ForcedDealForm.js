/* @flow */
import React from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Modal, Button, Panel } from 'react-bootstrap'
import PropertySet from '../PropertySet'
import MultiplePlayerPropertyCardSelector from '../MultiplePlayerPropertyCardSelector'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import PropertySetClass from '../../../../monopoly/PropertySet'

type Props = {
  otherPlayers: Player[],
  thisPlayer: Player,
  onSubmit: (
    playerToForceDeal: Player,
    cardToForceDealSetId: PropertySetId,
    cardToForceDeal: CardKey,
    cardUsedToSwapSetId: PropertySetId,
    cardUsedToSwap: CardKey
  ) => void,
  onCancel: () => void
}

type State = {
  playerToForceDeal: Player,
  cardUsedToSwapSetIndex: number,
  cardUsedToSwapIndex: CardKey,
  cardToForceDealSetIndex: number,
  cardToForceDealIndex: CardKey
}

export default class ForcedDealForm extends React.Component {
  props: Props

  state: State

  state = {
    playerToForceDeal: undefined,
    cardUsedToSwapSetIndex: undefined,
    cardUsedToSwapIndex: undefined,
    cardToForceDealSetIndex: undefined,
    cardToForceDealIndex: undefined
  }

  onToggleCardUsedToSwap = (cardUsedToSwapSetIndex: number, cardUsedToSwapIndex: number) => {
    if (this.isCardUsedToSwap(cardUsedToSwapSetIndex, cardUsedToSwapIndex)) {
      this.setState({ cardUsedToSwapSetIndex: undefined, cardUsedToSwapIndex: undefined })
      return
    }

    this.setState({ cardUsedToSwapSetIndex, cardUsedToSwapIndex })
  }

  isCardUsedToSwap = (setIndex: number, cardIndex: number): boolean => {
    const { cardUsedToSwapSetIndex, cardUsedToSwapIndex } = this.state

    if (cardUsedToSwapSetIndex === undefined || cardUsedToSwapIndex === undefined) {
      return false
    }

    return cardUsedToSwapSetIndex === setIndex && cardUsedToSwapIndex === cardIndex
  }

  onSelectCardToForceDeal = (player: Player, setIndex: number, cardIndex: number) => {
    this.setState({ playerToForceDeal: player, cardToForceDealSetIndex: setIndex, cardToForceDealIndex: cardIndex })
  }

  onUnselectCardToForceDeal = () => {
    this.setState({
      playerToForceDeal: undefined,
      cardToForceDealSetIndex: undefined,
      cardToForceDealIndex: undefined
    })
  }

  renderThisPlayerPropertyCards = () => {
    const { thisPlayer } = this.props
    const propertySets = thisPlayer.placedCards.serializedPropertySets.map(PropertySetClass.unserialize)

    return (
      <Panel>
        <ul className='list-inline'>
          {propertySets.map((set, setIndex) =>
            <li key={setIndex}>
              <PropertySet
                propertySet={set}
                onCardClick={(card, cardIndex) => this.onToggleCardUsedToSwap(setIndex, cardIndex)}
                isCardHighlighted={(card, cardIndex) => this.isCardUsedToSwap(setIndex, cardIndex)}
              />
            </li>
          )}
        </ul>
      </Panel>
    )
  }

  renderOtherPlayerPropertyCards = () => {
    const { otherPlayers } = this.props

    return (
      <MultiplePlayerPropertyCardSelector
        players={otherPlayers}
        onCardSelect={this.onSelectCardToForceDeal}
        onCardUnselect={this.onUnselectCardToForceDeal}
        playerPropertySetFilter={set => !set.isFullSet()}
      />
    )
  }

  submit = () => {
    const {
      playerToForceDeal,
      cardUsedToSwapSetIndex,
      cardUsedToSwapIndex,
      cardToForceDealSetIndex,
      cardToForceDealIndex
    } = this.state

    if (
      playerToForceDeal === undefined ||
      cardUsedToSwapSetIndex === undefined ||
      cardUsedToSwapIndex === undefined ||
      cardToForceDealSetIndex === undefined ||
      cardToForceDealIndex === undefined
    ) {
      return
    }

    const { thisPlayer, onSubmit } = this.props
    const unserialize = PropertySetClass.unserialize

    const cardUsedToSwapSet = unserialize(thisPlayer.placedCards.serializedPropertySets[cardUsedToSwapSetIndex])
    const cardToForceDealSet = unserialize(
      playerToForceDeal.placedCards.serializedPropertySets[cardToForceDealSetIndex]
    )

    onSubmit(
      playerToForceDeal,
      cardToForceDealSet.getId(),
      cardToForceDealSet.cards[cardToForceDealIndex],
      cardUsedToSwapSet.getId(),
      cardUsedToSwapSet.cards[cardUsedToSwapIndex]
    )
  }

  render () {
    const { cardUsedToSwapIndex, cardToForceDealIndex } = this.state
    const { onCancel } = this.props

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>Forced Deal</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3>1. Select the card you want to use to swap</h3>
          {this.renderThisPlayerPropertyCards()}

          {cardUsedToSwapIndex !== undefined &&
            <div>
              <h3>2. Select the card you want to force deal</h3>
              {this.renderOtherPlayerPropertyCards()}
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button className='pull-left' onClick={onCancel}>
            Cancel
          </Button>

          <Button bsStyle='primary' onClick={this.submit} disabled={cardToForceDealIndex === undefined}>
            Force Deal
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
