/* @flow */
import React from 'react'
import { Modal, Button, Panel } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import PropertySet from '../PropertySet'
import { unserializePropertySet } from '../../../../monopoly/monopoly'
import PropertySetType from '../../../../monopoly/PropertySet'

type Props = {
  header: string,
  subheader: string,
  players: Player[],
  onSelect: (player: Player, set: PropertySetType, card: CardKey) => void,
  onCancel: () => void
}

type State = {
  player: Player,
  setIndex: number,
  selectedCardIndex: number
}

export default class OtherPlayerCardSelector extends React.Component {
  props: Props

  state: State

  state = {
    player: undefined,
    setIndex: undefined,
    selectedCardIndex: undefined
  }

  onCardClick = (player: Player, setIndex: number, selectedCardIndex: number) => {
    if (this.isCardHighlighted(player, setIndex, selectedCardIndex)) {
      this.setState({
        player: undefined,
        setIndex: undefined,
        selectedCardIndex: undefined
      })
      return
    }

    this.setState({
      player,
      setIndex,
      selectedCardIndex
    })
  }

  isCardHighlighted = (player: Player, setIndex: number, selectedCardIndex: number): boolean => {
    return !!this.state.player &&
    this.state.player.id === player.id &&
    this.state.setIndex === setIndex &&
    this.state.selectedCardIndex === selectedCardIndex
  }

  select = () => {
    const { player, setIndex, selectedCardIndex } = this.state
    if (!player || !setIndex || !selectedCardIndex) {
      return
    }
    const set = player.placedCards.serializedPropertySets[setIndex]
    this.props.onSelect(player, unserializePropertySet(set), set.cards[selectedCardIndex])
  }

  renderPlayerPropertySets (player: Player) {
    return (
      <ul className='list-inline'>
        {player.placedCards.serializedPropertySets.map((set, setIndex) =>
          <li key={`${player.id}-${setIndex}`}>
            <PropertySet
              key={`${player.id}-${setIndex}`}
              propertySet={unserializePropertySet(set)}
              onCardClick={(card, cardIndex) => this.onCardClick(player, setIndex, cardIndex)}
              isCardHighlighted={(card, cardIndex) => this.isCardHighlighted(player, setIndex, cardIndex)}
            />
          </li>
        )}
      </ul>
    )
  }

  render () {
    const { header, subheader, players, onCancel } = this.props
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
          {players.map(player =>
            <Panel header={<div>Player: {player.username}</div>}
            >
              {this.renderPlayerPropertySets(player)}
            </Panel>
          )}
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
