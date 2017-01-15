/* @flow */
import React from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Alert, Modal, Button } from 'react-bootstrap'
import { getTotalMoneyFromPlacedCards } from '../../../../monopoly/monopoly'
import PropertySet from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  payee: Username,
  dueAmount: number,
  cards: PlacedCards,
  sayNoButton: ?Node,
  onPay: (moneyCards: CardKey[], leftOverCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => void
}

type State = {
  counter: number
}

const INITIAL_COUNTER_IN_SECONDS = 10

export default class AutoPaymentAlert extends React.Component {
  props: Props

  state: State

  shouldCountDown: boolean

  intervalId: number

  state = {
    counter: INITIAL_COUNTER_IN_SECONDS
  }

  constructor (props: Props) {
    super(props)

    this.shouldCountDown = !this.props.sayNoButton

    if (this.shouldCountDown) {
      this.intervalId = setInterval(() => {
        this.setState({ counter: this.state.counter - 1 })
      }, 1000)
    }
  }

  componentWillUnmount () {
    this.intervalId && clearInterval(this.intervalId)
  }

  componentWillUpdate (nextProps: Props, nextState: State) {
    if (!nextProps.countDown || nextState.counter !== 0) {
      return
    }

    this.pay()
  }

  pay = () => {
    const { cards, onPay } = this.props

    const mapOfNonMoneyCards: Map<PropertySetId, CardKey[]> = new Map()

    cards.serializedPropertySets.forEach(item => {
      const set = PropertySet.unserialize(item)
      mapOfNonMoneyCards.set(set.getId(), set.getCards())
    })

    onPay(cards.bank, cards.leftOverCards, mapOfNonMoneyCards)
  }

  hasSayNoOption () {
    return !!this.props.sayNoButton
  }

  render () {
    const { payee, dueAmount, cards, sayNoButton } = this.props
    const { counter } = this.state
    const hasNoMoney = getTotalMoneyFromPlacedCards(cards) === 0
    const hasSayNoOption = this.hasSayNoOption()

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>
            Payment
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You don't have enough money to pay <strong>{payee}</strong> ${dueAmount}M :(</p>

          {this.shouldCountDown && !hasNoMoney &&
            <Alert bsStyle='warning'>
              Giving all your cards to <strong>{payee}</strong> in {counter} seconds
            </Alert>
          }

          {this.shouldCountDown && hasNoMoney &&
            <Alert bsStyle='info'>
              This will close in {counter} seconds
            </Alert>
          }
        </Modal.Body>

        <Modal.Footer>
          {hasSayNoOption &&
            <div className='pull-left'>
              {sayNoButton}
            </div>
          }
          <Button
            onClick={this.pay}
          >
            {!hasNoMoney &&
              ('Give all cards now!')
            }

            {hasNoMoney &&
              ('Close')
            }
          </Button>
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
