/* @flow */
import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import MultiplePlayerPropertyCardSelector from '../MultiplePlayerPropertyCardSelector'
import PropertySetClass from '../../../../monopoly/PropertySet'

type Props = {
  header: string,
  subheader: string,
  players: Player[],
  onSelect: (player: Player, set: PropertySetClass, card: CardKey) => void,
  onCancel: () => void,
  playerPropertySetFilter: (propertySet: PropertySetClass) => boolean
}

type State = {
  player: Player,
  setIndex: number,
  selectedCardIndex: number
}

export default class MultiplePlayerPropertyCardSelectorForm extends React.Component {
  props: Props

  state: State

  state = {
    player: undefined,
    setIndex: undefined,
    selectedCardIndex: undefined
  }

  onCardSelect = (player: Player, setIndex: number, selectedCardIndex: number) => {
    this.setState({
      player,
      setIndex,
      selectedCardIndex
    })
  }

  onCardUnselect = () => {
    this.setState({
      player: undefined,
      setIndex: undefined,
      selectedCardIndex: undefined
    })
  }

  select = () => {
    const { player, setIndex, selectedCardIndex } = this.state
    if (player === undefined || setIndex === undefined || selectedCardIndex === undefined) {
      return
    }
    const set = player.placedCards.serializedPropertySets[setIndex]
    this.props.onSelect(player, PropertySetClass.unserialize(set), set.cards[selectedCardIndex])
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
          <MultiplePlayerPropertyCardSelector
            players={players}
            onCardSelect={this.onCardSelect}
            onCardUnselect={this.onCardUnselect}
            playerPropertySetFilter={playerPropertySetFilter}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle='primary'
            disabled={selectedCardIndex === undefined}
            onClick={this.select}
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
