/* @flow */
import React from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Modal, Button } from 'react-bootstrap'
import { getTotalMoneyFromPlacedCards } from '../../../../monopoly/monopoly'
import PropertySet from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  payee: Username,
  dueAmount: number,
  cards: PlacedCards,
  sayNoButton: ?React$Element<*>,
  onPay: (moneyCards: CardKey[], leftOverCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => void
}

export default class PaymentAlert extends React.Component {
  props: Props

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
