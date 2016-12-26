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
  header: string,
  inputLabel: string,
  submitLabel: string,
  allowSpaces: boolean,
  cancelable: boolean,
  onSubmit: (value: string) => void,
  onCancel: () => void
}

type State = {
  value: string
}

export default class TextFormDialog extends React.Component {
  props: Props

  state: State

  state = {
    value: ''
  }

  static defaultProps = {
    allowSpaces: false,
    cancelable: false
  }

  getValidationState () {
    const { value } = this.state

    if (!value) {
      return 'error'
    }

    return 'success'
  }

  handleChange = (e: SyntheticInputEvent) => {
    this.setState({
      value: this.props.allowSpaces ? e.target.value : e.target.value.trim()
    })
  }

  submit = () => {
    const { value } = this.state
    value && this.props.onSubmit(value)
  }

  render () {
    const {
      header,
      inputLabel,
      submitLabel,
      onCancel,
      cancelable
    } = this.props

    return (
      <Modal.Dialog autoFocus>
        <Modal.Header>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId='join-form'
            validationState={this.getValidationState()}
          >
            <ControlLabel>{inputLabel}</ControlLabel>
            <FormControl
              type='text'
              autoFocus
              value={this.state.value}
              onChange={this.handleChange}
             />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.submit} bsStyle='primary'>{submitLabel}</Button>
          {cancelable &&
            <Button onClick={onCancel} className='pull-left'>Cancel</Button>
          }
        </Modal.Footer>
      </Modal.Dialog>
    )
  }
}
