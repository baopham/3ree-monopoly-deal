/* @flow */
import React from 'react'
import {
  Button,
  Modal,
  Alert
} from 'react-bootstrap'
import PropertySet from '../PropertySet'
import Card from '../../../../components/Card'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import * as monopoly from '../../../../monopoly/monopoly'
import * as helper from './helper'
import PropertySetClass from '../../../../monopoly/PropertySet'
import type { MoneyCardType, CardIndex, SerializedPropertySetIndex, NonMoneyCardTuple, MoneyCardTuple } from './helper'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

const BANK_CARD: MoneyCardType = 'bank'
const LEFT_OVER_CARD: MoneyCardType = 'leftOverCard'

type Props = {
  cards: PlacedCards,
  payee: Username,
  dueAmount: number,
  sayNoButton: ?React$Element<*>,
  onPay: (bankCards: CardKey[], leftOverCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => void
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

  toggleSelectMoneyCard = (card: CardKey, type: MoneyCardType, index: CardIndex) => {
    const { selectedMoneyCards } = this.state
    const tuple: MoneyCardTuple = [card, type, index]

    if (this.isMoneyCardHighlighted(card, type, index)) {
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
    const bankCards = selectedMoneyCards
      .filter(([c, type]) => type === BANK_CARD)
      .map(([c]) => c)

    const leftOverCards = selectedMoneyCards
      .filter(([c, type]) => type === LEFT_OVER_CARD)
      .map(([c]) => c)

    this.props.onPay(bankCards, leftOverCards, mapOfNonMoneyCards)
  }

  isMoneyCardHighlighted = (card: CardKey, type: MoneyCardType, index: CardIndex): boolean => {
    return helper.cardIsSelected([card, type, index], this.state.selectedMoneyCards)
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
      <Alert bsStyle={bsStyle}>
        You selected ${amountSelected}M
      </Alert>
    )
  }

  renderMoneyCards (): React.Element<*> {
    const { cards } = this.props
    const bankCards = cards.bank
    const moneyCardsFromLeftOverList = cards.leftOverCards.filter(card => monopoly.cardCanBeMoney(card))

    return (
      <ul className='list-inline'>
        {bankCards.map((card, i) =>
          <li key={`bank-${i}`}>
            <Card
              highlighted={this.isMoneyCardHighlighted(card, BANK_CARD, i)}
              onClick={() => this.toggleSelectMoneyCard(card, BANK_CARD, i)}
              card={card}
              size='small'
              faceUp
            />
          </li>
        )}

        {moneyCardsFromLeftOverList.map((card, i) =>
          <li key={`left-over-${i}`}>
            <Card
              highlighted={this.isMoneyCardHighlighted(card, LEFT_OVER_CARD, i)}
              onClick={() => this.toggleSelectMoneyCard(card, LEFT_OVER_CARD, i)}
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
      dueAmount,
      sayNoButton
    } = this.props

    const propertySets = cards.serializedPropertySets.map(PropertySetClass.unserialize)

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
          {this.renderMoneyCards()}
          <ul className='list-inline'>
            {propertySets.map((set, setIndex) =>
              <li key={setIndex}>
                <PropertySet
                  onCardClick={(card, cardIndex) => this.toggleSelectNonMoneyCard(card, cardIndex, setIndex)}
                  isCardHighlighted={(card, cardIndex) => this.isNonMoneyCardHighlighted(card, cardIndex, setIndex)}
                  propertySet={set}
                />
              </li>
            )}
          </ul>
        </Modal.Body>

        <Modal.Footer>
          {!!sayNoButton &&
            <div className='pull-left'>
              {sayNoButton}
            </div>
          }
          <Button
            bsStyle='primary'
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
