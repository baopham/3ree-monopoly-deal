/* @flow */
import React from 'react'
import { Modal, Button, Panel } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import PropertySet from '../PropertySet'
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
    if (player === undefined || setIndex === undefined || selectedCardIndex === undefined) {
      return
    }
    const set = player.placedCards.serializedPropertySets[setIndex]
    this.props.onSelect(player, PropertySetClass.unserialize(set), set.cards[selectedCardIndex])
  }

  renderPlayerPropertySets = (player: Player) => {
    const { playerPropertySetFilter } = this.props
    const propertySets = player.placedCards.serializedPropertySets
      .map(PropertySetClass.unserialize)

    return (
      <ul className='list-inline'>
        {propertySets.map((set, setIndex) =>
          <li key={`${player.id}-${setIndex}`}>
            {playerPropertySetFilter(set) &&
              <PropertySet
                propertySet={set}
                onCardClick={(card, cardIndex) => this.onCardClick(player, setIndex, cardIndex)}
                isCardHighlighted={(card, cardIndex) => this.isCardHighlighted(player, setIndex, cardIndex)}
              />
            }
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
            <Panel key={player.id} header={<div>Player: {player.username}</div>}>
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
