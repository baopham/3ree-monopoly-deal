import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'

export default class PaymentInProgress extends React.Component {
  static propTypes = {
    amount: PropTypes.number.isRequired
  }

  render () {
    const { amount } = this.props

    return (
      <Modal show autoFocus>
        <Modal.Header>
          Payment In Progress
        </Modal.Header>

        <Modal.Body>
          <p>Please wait for other players to finish paying you ${amount}M</p>
        </Modal.Body>
      </Modal>
    )
  }
}
