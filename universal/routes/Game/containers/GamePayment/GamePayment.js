/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import PaymentForm from '../../components/PaymentForm'
import AutoPaymentAlert from '../../components/AutoPaymentAlert'
import PaymentInProgress from '../../components/PaymentInProgress'
import { getCurrentPlayer } from '../../modules/gameSelectors'
import { actions as paymentActions } from '../../modules/payment'
import { getTotalMoneyFromPlacedCards } from '../../../../monopoly/monopoly'
import type { PaymentState } from '../../modules/payment'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  currentPlayer: Player,
  payment: PaymentState,
  pay: (payer: Username, moneyCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => void
}

const mapStateToProps = (state) => ({
  currentPlayer: getCurrentPlayer(state),
  payment: state.payment
})

export class GamePayment extends React.Component {
  props: Props

  onPay = (moneyCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => {
    const { pay, currentPlayer } = this.props
    pay(currentPlayer.username, moneyCards, mapOfNonMoneyCards)
  }

  payerHasNotEnoughMoney (): boolean {
    const { currentPlayer, payment } = this.props
    const { placedCards } = currentPlayer
    const totalAmount = getTotalMoneyFromPlacedCards(placedCards)
    return !!(payment.amount && totalAmount <= payment.amount)
  }

  isPayee (): boolean {
    const { currentPlayer, payment } = this.props
    return !!(currentPlayer && payment.amount && payment.payee === currentPlayer.username)
  }

  needToPay (): boolean {
    const { currentPlayer, payment } = this.props
    return !!(currentPlayer && !this.isPayee() && payment.payers && payment.payers.includes(currentPlayer.username))
  }

  render () {
    const { currentPlayer, payment } = this.props
    const isPayee = this.isPayee()
    const needToPay = this.needToPay()
    const needToPayAndHaveEnoughMoney = needToPay && !this.payerHasNotEnoughMoney()

    return (
      <div>
        {payment.payee && needToPayAndHaveEnoughMoney &&
          <PaymentForm
            onPay={this.onPay}
            cards={currentPlayer.placedCards}
            payee={payment.payee}
            dueAmount={payment.amount}
          />
        }

        {payment.payee && needToPay && !needToPayAndHaveEnoughMoney &&
          <AutoPaymentAlert
            onPay={this.onPay}
            cards={currentPlayer.placedCards}
            payee={payment.payee}
            dueAmount={payment.amount}
          />
        }

        {isPayee &&
          <PaymentInProgress
            amount={payment.amount}
          />
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...paymentActions }
)(GamePayment)
