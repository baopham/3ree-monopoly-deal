/* @flow */
import React from 'react'
import {
  Button,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

type Props = {
  onJoin: (username: Username) => void
}

type State = {
  username: string
}

export default class JoinForm extends React.Component {
  props: Props

  state: State

  constructor (props: Props) {
    super(props)

    this.state = {
      username: ''
    }
  }

  getValidationState () {
    const { username } = this.state

    if (!username) {
      return 'error'
    }

    return 'success'
  }

  handleChange = (e: SyntheticInputEvent) => {
    this.setState({
      username: e.target.value && e.target.value.trim()
    })
  }

  join = () => {
    const { username } = this.state
    username && this.props.onJoin(username)
  }

  render () {
    return (
      <Modal.Dialog autoFocus>
        <Modal.Header>
          <Modal.Title>Join Game</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId='join-form'
            validationState={this.getValidationState()}
          >
            <ControlLabel>Username</ControlLabel>
            <FormControl
              type='text'
              autoFocus
              value={this.state.username}
              onChange={this.handleChange}
             />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.join}>Join</Button>
        </Modal.Footer>
      </Modal.Dialog>
    )
  }
}
