/* @flow */
import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import MultiplePlayerCardSelector from '../MultiplePlayerCardSelector'
import PropertySetClass from '../../../../monopoly/PropertySet'
import { SetCardType, LeftOverCardType } from '../../../../monopoly/cardRequestTypes'
import type { CardType } from '../../../../monopoly/cardRequestTypes'

type Props = {
  header: string,
  subheader: string,
  players: Player[],
  onSetCardSelect: (player: Player, set: PropertySetClass, card: CardKey) => void,
  onLeftOverCardSelect: (player: Player, card: CardKey) => void,
  onCancel: () => void,
  playerPropertySetFilter: (propertySet: PropertySetClass) => boolean
}

type State = {
  player: Player,
  cardType: CardType,
  setIndex: number,
  selectedCardIndex: number
}

export default class SlyDealForm extends React.Component {
  props: Props

  state: State

  state = {
    player: undefined,
    cardType: undefined,
    setIndex: undefined,
    selectedCardIndex: undefined
  }

  onSetCardSelect = (player: Player, setIndex: number, selectedCardIndex: number) => {
    this.setState({
      player,
      cardType: SetCardType,
      setIndex,
      selectedCardIndex
    })
  }

  onLeftOverCardSelect = (player: Player, selectedCardIndex: number) => {
    this.setState({
      player,
      cardType: LeftOverCardType,
      setIndex: undefined,
      selectedCardIndex
    })
  }

  onCardUnselect = () => {
    this.setState({
      player: undefined,
      cardType: undefined,
      setIndex: undefined,
      selectedCardIndex: undefined
    })
  }

  submit = () => {
    const { player, cardType, setIndex, selectedCardIndex } = this.state
    if (player === undefined || cardType === undefined || selectedCardIndex === undefined) {
      return
    }

    if (cardType === LeftOverCardType) {
      return this.props.onLeftOverCardSelect(player, player.placedCards.leftOverCards[selectedCardIndex])
    }

    if (cardType === SetCardType && setIndex !== undefined) {
      const set = player.placedCards.serializedPropertySets[setIndex]

      return this.props.onSetCardSelect(
        player,
        PropertySetClass.unserialize(set),
        set.cards[selectedCardIndex]
      )
    }
  }

  render () {
    const { header, subheader, players, onCancel, playerPropertySetFilter } = this.props
    const { selectedCardIndex } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            {header}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5>{subheader}</h5>
          <MultiplePlayerCardSelector
            players={players}
            onSetCardSelect={this.onSetCardSelect}
            onLeftOverCardSelect={this.onLeftOverCardSelect}
            onCardUnselect={this.onCardUnselect}
            playerPropertySetFilter={playerPropertySetFilter}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle='primary'
            disabled={selectedCardIndex === undefined}
            onClick={this.submit}
          >
            Select
          </Button>

          <Button
            className='pull-left'
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
