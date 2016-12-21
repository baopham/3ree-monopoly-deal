import React, { PropTypes } from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import {
  Modal,
  Alert,
  Button
} from 'react-bootstrap'

const INITIAL_COUNTER = 10
const INTERVAL_DELAY = 1000

export default class AutoPaymentAlert extends React.Component {
  static propTypes = {
    payee: PropTypes.string.isRequired,
    dueAmount: PropTypes.number.isRequired,
    onPay: PropTypes.func.isRequired,
    cards: PropTypes.shape({
      bank: PropTypes.arrayOf(PropTypes.string),
      properties: PropTypes.arrayOf(PropTypes.string)
    })
  }

  constructor (...args) {
    super(...args)

    this.state = {
      counter: INITIAL_COUNTER
    }

    this.intervalId = setInterval(() => {
      this.setState({
        counter: this.state.counter - 1
      })
    }, INTERVAL_DELAY)
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.counter > 0) {
      return
    }

    this.pay()
  }

  pay = () => {
    const { cards, onPay } = this.props

    onPay(cards.bank.concat(cards.properties))
  }

  render () {
    const { payee, dueAmount } = this.props
    const { counter } = this.state

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            Payment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You don't have enough money to pay <strong>{payee}</strong> ${dueAmount}M :(</p>

          <Alert bsStyle='warning'>
            Giving all your cards to <strong>{payee}</strong> in {counter} seconds
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={this.pay}
          >
            Give all cards now!
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
