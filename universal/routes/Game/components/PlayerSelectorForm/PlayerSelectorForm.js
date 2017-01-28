/* @flow */
import React from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import {
  Button,
  Modal,
  ControlLabel,
  FormGroup,
  FormControl
} from 'react-bootstrap'

type Props = {
  label: string,
  players: Player[],
  onSubmit: (selectedPlayer: Player) => void,
  onCancel: () => void
}

type State = {
  selectedPlayer: ?Player
}

export default class PlayerSelectorForm extends React.Component {
  input: HTMLInputElement

  props: Props

  state: State = {
    selectedPlayer: undefined
  }

  onSelect = (event: SyntheticInputEvent) => {
    const selectedPlayerId = event.target.value
    const selectedPlayer = selectedPlayerId
      ? this.props.players.find(player => player.id === selectedPlayerId)
      : undefined
    this.setState({ selectedPlayer })
  }

  handleInputRef = (input: HTMLInputElement) => {
    this.input = input
  }

  submit = () => {
    const { selectedPlayer } = this.state
    selectedPlayer && this.props.onSubmit(selectedPlayer)
  }

  render () {
    const { label, players, onCancel } = this.props
    const { selectedPlayer } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>Select a player</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
              componentClass='select'
              inputRef={this.handleInputRef}
              onChange={this.onSelect}
            >
              <option value={undefined}>-</option>
              {players.map(player =>
                <option key={player.id} value={player.id}>
                  {player.username}
                </option>
              )}
            </FormControl>
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle='primary'
            disabled={selectedPlayer === undefined}
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
