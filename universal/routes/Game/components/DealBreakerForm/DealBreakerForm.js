/* @flow */
import React from 'react'
import { Modal, Button, Panel } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import PropertySetSelector from '../PropertySetSelector'
import PropertySetClass from '../../../../monopoly/PropertySet'

type Props = {
  otherPlayers: Player[],
  onSelect: (playerToDealBreakFrom: Player, setToDealBreak: PropertySetClass) => void,
  onCancel: () => void
}

type State = {
  setIndex: number,
  player: Player
}

export default class DealBreakerForm extends React.Component {
  props: Props

  state: State

  state = {
    setIndex: undefined,
    player: undefined
  }

  submit = () => {
    const { onSelect } = this.props
    const { player, setIndex } = this.state

    if (!player || setIndex === undefined) {
      return
    }

    onSelect(player, PropertySetClass.unserialize(player.placedCards.serializedPropertySets[setIndex]))
  }

  onToggleSet = (player: Player, setIndex: number) => {
    if (this.setIsSelected(player, setIndex)) {
      this.setState({
        player: undefined,
        setIndex: undefined
      })

      return
    }

    this.setState({
      player,
      setIndex
    })
  }

  setIsSelected = (player: Player, setIndex: number): boolean => {
    return !!this.state.player && this.state.player.id === player.id && this.state.setIndex === setIndex
  }

  renderOtherPlayerFullSets (player: Player) {
    const sets = player.placedCards.serializedPropertySets
      .map(PropertySetClass.unserialize)

    return (
      <PropertySetSelector
        propertySets={sets}
        setIsSelected={setIndex => this.setIsSelected(player, setIndex)}
        onClick={setIndex => this.onToggleSet(player, setIndex)}
        setFilter={(set: PropertySetClass) => set.isFullSet()}
      />
    )
  }

  render () {
    const { otherPlayers, onCancel } = this.props
    const { setIndex } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            Deal Breaker
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5>Select a set to deal break</h5>
          {otherPlayers.map(player =>
            <Panel key={player.id} header={player.username}>
              {this.renderOtherPlayerFullSets(player)}
            </Panel>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle='primary'
            disabled={setIndex === undefined}
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
