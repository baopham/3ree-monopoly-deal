import React, { PropTypes } from 'react'
import {
  Button,
  Modal,
  Alert
} from 'react-bootstrap'
import Properties from '../Properties'
import Card from '../Card'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { totalAmount } from '../../../../monopoly/monopoly'

export default class PaymentForm extends React.Component {
  static propTypes = {
    onPay: PropTypes.func.isRequired,
    cards: PropTypes.shape({
      bank: PropTypes.arrayOf(PropTypes.string),
      properties: PropTypes.arrayOf(PropTypes.string)
    }),
    payee: PropTypes.string.isRequired,
    dueAmount: PropTypes.number.isRequired
  }

  constructor (...args) {
    super(...args)

    this.state = {
      selectedCards: []
    }
  }

  componentWillUnmount () {
    this.setState({
      selectedCards: []
    })
  }

  selectCard (card, index) {
    this.setState({
      selectedCards: this.state.selectedCards.concat([[card, index]])
    })
  }

  unselectCard (card, index) {
    const { selectedCards } = this.state

    this.setState({
      selectedCards: selectedCards.filter(([c, i]) => c !== card || i !== index)
    })
  }

  toggleSelectCard = (card, index) => {
    if (this.isCardHighlighted(card, index)) {
      this.unselectCard(card, index)
      return
    }

    this.selectCard(card, index)
  }

  pay = () => {
    const { selectedCards } = this.state
    this.props.onPay(selectedCards.map(([card, index]) => card))
  }

  isCardHighlighted = (card, index) => {
    return !!this.state.selectedCards.find(([c, i]) => c === card && i === index)
  }

  renderTotalAmountAlert () {
    const { dueAmount } = this.props

    const amountSelected = this.getAmountSelected()
    const bsStyle = amountSelected >= dueAmount ? 'success' : 'warning'

    return (
      <Alert
        bsStyle={bsStyle}
      >
        You selected ${amountSelected}M
      </Alert>
    )
  }

  renderBankCards () {
    const { cards } = this.props

    return (
      <ul className='list-inline'>
        {cards.bank.map((card, i) =>
          <li key={i}>
            <Card
              highlighted={this.isCardHighlighted(card, i)}
              onClick={() => this.toggleSelectCard(card, i)}
              card={card}
              size='small'
              faceUp
            />
          </li>
        )}
      </ul>
    )
  }

  getAmountSelected () {
    return totalAmount(this.state.selectedCards.map(([card, index]) => card))
  }

  render () {
    const {
      cards,
      payee,
      dueAmount
    } = this.props

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            Payment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>Select cards to pay {payee} ${dueAmount}M</h4>
          {this.renderTotalAmountAlert()}
          {this.renderBankCards()}
          <Properties
            properties={cards.properties}
            onCardClick={this.toggleSelectCard}
            isCardHighlighted={this.isCardHighlighted}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            disabled={this.getAmountSelected() < dueAmount}
            onClick={this.pay}
          >
            Pay
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
