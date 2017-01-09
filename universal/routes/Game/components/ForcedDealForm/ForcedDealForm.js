/* @flow */
import React from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Modal, Button, Panel } from 'react-bootstrap'
import PropertySet from '../PropertySet'
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
  cardUsedToSwap: CardKey,
  cardToForceDealSetIndex: number,
  cardToForceDeal: CardKey
}

export default class ForcedDealForm extends React.Component {
  props: Props

  state: State

  state = {
    playerToForceDeal: undefined,
    cardUsedToSwapSetIndex: undefined,
    cardUsedToSwap: undefined,
    cardToForceDealSetIndex: undefined,
    cardToForceDeal: undefined
  }

  onSelectCardUsedToSwap (cardUsedToSwapSetIndex: number, cardUsedToSwap: CardKey) {
    this.setState({ cardUsedToSwapSetIndex, cardUsedToSwap })
  }

  isCardUsedToSwap (setIndex: number, card: CardKey): boolean {
    const { cardUsedToSwapSetIndex, cardUsedToSwap } = this.state

    if (cardUsedToSwapSetIndex === undefined || cardUsedToSwap === undefined) {
      return false
    }

    return cardUsedToSwapSetIndex === setIndex && cardUsedToSwap === card
  }

  renderThisPlayerPropertyCards () {
    const { thisPlayer } = this.props
    const propertySets = thisPlayer.placedCards.serializedPropertySets.map(PropertySetClass.unserialize)

    return (
      <Panel>
        {propertySets.map((set, setIndex) =>
          <PropertySet
            key={set.getId()}
            propertySet={set}
            onCardClick={(card, cardIndex) => this.onSelectCardUsedToSwap(setIndex, card)}
            isCardHighlighted={(card, cardIndex) => this.isCardUsedToSwap(setIndex, card)}
          />
        )}
      </Panel>
    )
  }

  render () {
    const { cardUsedToSwap } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>Forced Deal</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3>1. Select the card you want to use to force deal</h3>
          {this.renderThisPlayerPropertyCards()}

          {cardUsedToSwap &&
            <div>
              <h3>2. Select the card you want to force deal</h3>
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          <Button className='pull-left'>
            Cancel
          </Button>

          <Button bsStyle='primary'>
            Force Deal
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
