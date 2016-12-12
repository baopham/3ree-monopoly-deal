import React, { PropTypes } from 'react'
import {
  Button,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap'

export default class JoinForm extends React.Component {
  static propTypes = {
    onJoin: PropTypes.func.isRequired
  }

  constructor (...args) {
    super(...args)

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

  handleChange = (e) => {
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

