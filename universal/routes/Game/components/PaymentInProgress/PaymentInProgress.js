import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'

export default class PaymentInProgress extends React.Component {
  static propTypes = {
    amount: PropTypes.number.isRequired
  }

  render () {
    const { amount } = this.props

    return (
      <ScrollableBackgroundModal
        show
      >
        <Modal.Header>
          <Modal.Title>
            Payment In Progress
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Please wait for other players to finish paying you ${amount}M</p>
        </Modal.Body>
      </ScrollableBackgroundModal>
    )
  }
}
