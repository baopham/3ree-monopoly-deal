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
import * as helper from './helper'
import type { CardIndex, SerializedPropertySetIndex, NonMoneyCardTuple, MoneyCardTuple } from './helper'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  onPay: (moneyCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => void,
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

  state = {
    selectedMoneyCards: [],
    selectedNonMoneyCards: []
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
    const mapOfNonMoneyCards = helper.getMapOfNonMoneyCards(selectedNonMoneyCards, serializedPropertySets)
    const moneyCards = selectedMoneyCards.map(([c]) => c)

    this.props.onPay(moneyCards, mapOfNonMoneyCards)
  }

  isMoneyCardHighlighted = (card: CardKey, index: CardIndex): boolean => {
    return helper.cardIsSelected([card, index], this.state.selectedMoneyCards)
  }

  isNonMoneyCardHighlighted = (
    card: CardKey,
    cardIndex: CardIndex,
    serializedPropertySetIndex: SerializedPropertySetIndex
  ): boolean => {
    return helper.cardIsSelected([card, cardIndex, serializedPropertySetIndex], this.state.selectedNonMoneyCards)
  }

  renderTotalAmountAlert (): Node {
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

  renderBankCards (): React.Element<*> {
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

  getAmountSelected (): number {
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
