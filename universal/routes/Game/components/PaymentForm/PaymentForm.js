/* @flow */
import React from 'react'
import {
  Button,
  Modal,
  Alert
} from 'react-bootstrap'
import Properties from '../Properties'
import Card from '../Card'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import * as monopoly from '../../../../monopoly/monopoly'
import type { CardIndex, SerializedPropertySetIndex, NonMoneyCardTuple, MoneyCardTuple } from './helper'
import * as helper from './helper'

type Props = {
  onPay: (moneyCards: CardKey[], serializedPropertySets: SerializedPropertySet[]) => void,
  cards: PlacedCards,
  payee: Username,
  dueAmount: number
}

type State = {
  selectedMoneyCards: MoneyCardTuple[],
  selectedNonMoneyCards: NonMoneyCardTuple[]
}

export default class PaymentForm extends React.Component {
  props: Props

  state: State

  constructor (props: Props) {
    super(props)

    this.state = {
      selectedMoneyCards: [],
      selectedNonMoneyCards: []
    }
  }

  componentWillUnmount () {
    this.setState({
      selectedMoneyCards: [],
      selectedNonMoneyCards: []
    })
  }

  toggleSelectMoneyCard = (card: CardKey, index: CardIndex) => {
    const { selectedMoneyCards } = this.state
    const tuple: MoneyCardTuple = [card, index]

    if (this.isMoneyCardHighlighted(card, index)) {
      this.setState({
        selectedMoneyCards: helper.unselectCard(tuple, selectedMoneyCards)
      })

      return
    }

    this.setState({
      selectedMoneyCards: helper.selectCard(tuple, selectedMoneyCards)
    })
  }

  toggleSelectNonMoneyCard = (
    card: CardKey,
    cardIndex: CardIndex,
    serializedPropertySetIndex: SerializedPropertySetIndex
  ) => {
    const { selectedNonMoneyCards } = this.state
    const tuple: NonMoneyCardTuple = [card, cardIndex, serializedPropertySetIndex]

    if (this.isNonMoneyCardHighlighted(card, cardIndex, serializedPropertySetIndex)) {
      this.setState({
        selectedNonMoneyCards: helper.unselectCard(tuple, selectedNonMoneyCards)
      })

      return
    }

    this.setState({
      selectedNonMoneyCards: helper.selectCard(tuple, selectedNonMoneyCards)
    })
  }

  pay = () => {
    const { selectedMoneyCards, selectedNonMoneyCards } = this.state
    const { serializedPropertySets } = this.props.cards
    const [sets, leftOverCards] = helper.getSerializedPropertySetsFromMoneyCardTuples(
      selectedNonMoneyCards,
      serializedPropertySets
    )
    const moneyCards = selectedMoneyCards.map(([c]) => c).concat(leftOverCards)

    this.props.onPay(moneyCards, sets)
  }

  isMoneyCardHighlighted = (card: CardKey, index: CardIndex) => {
    return helper.cardIsSelected([card, index], this.state.selectedMoneyCards)
  }

  isNonMoneyCardHighlighted = (
    card: CardKey,
    cardIndex: CardIndex,
    serializedPropertySetIndex: SerializedPropertySetIndex
  ) => {
    return helper.cardIsSelected([card, cardIndex, serializedPropertySetIndex], this.state.selectedNonMoneyCards)
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
              highlighted={this.isMoneyCardHighlighted(card, i)}
              onClick={() => this.toggleSelectMoneyCard(card, i)}
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
    const { selectedMoneyCards, selectedNonMoneyCards } = this.state
    const allSelectedCards = selectedMoneyCards.map(([c]) => c).concat(selectedNonMoneyCards.map(([c]) => c))

    return monopoly.getTotalMoneyFromCards(allSelectedCards)
  }

  render () {
    const {
      cards,
      payee,
      dueAmount
    } = this.props

    const propertySets = cards.serializedPropertySets.map(monopoly.unserializePropertySet)

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
            propertySets={propertySets}
            onCardClick={this.toggleSelectNonMoneyCard}
            isCardHighlighted={this.isNonMoneyCardHighlighted}
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
