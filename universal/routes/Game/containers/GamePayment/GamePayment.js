/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import PaymentForm from '../../components/PaymentForm'
import AutoPaymentAlert from '../../components/AutoPaymentAlert'
import PaymentInProgressAlert from '../../components/PaymentInProgressAlert'
import SayNoButton from '../SayNoButton'
import { getCurrentPlayer, isPayee, isPayer, canSayNo } from '../../modules/gameSelectors'
import { actions as paymentActions } from '../../modules/payment'
import { getTotalMoneyFromPlacedCards } from '../../../../monopoly/monopoly'
import type { PaymentState } from '../../modules/payment'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import sayNoCauses from '../../../../monopoly/sayNoCauses'

type Props = {
  currentPlayer: Player,
  payment: PaymentState,
  isPayee: boolean,
  isPayer: boolean,
  canSayNo: boolean,
  pay: (
    payer: Username,
    bankCards: CardKey[],
    leftOverCards: CardKey[],
    mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>
  ) => void
}

const mapStateToProps = (state) => ({
  currentPlayer: getCurrentPlayer(state),
  payment: state.payment,
  isPayee: isPayee(state),
  isPayer: isPayer(state),
  canSayNo: canSayNo(state)
})

export class GamePayment extends React.Component {
  props: Props

  onPay = (bankCards: CardKey[], leftOverCards: CardKey[], mapOfNonMoneyCards: Map<PropertySetId, CardKey[]>) => {
    const { pay, currentPlayer } = this.props
    pay(currentPlayer.username, bankCards, leftOverCards, mapOfNonMoneyCards)
  }

  payerHasNotEnoughMoney (): boolean {
    const { currentPlayer, payment } = this.props
    const { placedCards } = currentPlayer
    const totalAmount = getTotalMoneyFromPlacedCards(placedCards)
    return !!(payment.amount && totalAmount <= payment.amount)
  }

  renderSayNoToPayeeButton () {
    const { canSayNo, payment } = this.props

    return canSayNo
      ? <SayNoButton toUser={payment.payee} cause={sayNoCauses.PAYMENT} clickOnceOnly>Say No?</SayNoButton>
      : null
  }

  render () {
    const { currentPlayer, payment, isPayee, isPayer } = this.props
    const needToPayAndHaveEnoughMoney = isPayer && !this.payerHasNotEnoughMoney()

    return (
      <div>
        {payment.payee && needToPayAndHaveEnoughMoney &&
          <PaymentForm
            onPay={this.onPay}
            cards={currentPlayer.placedCards}
            payee={payment.payee}
            dueAmount={payment.amount}
            sayNoButton={this.renderSayNoToPayeeButton()}
          />
        }

        {payment.payee && isPayer && !needToPayAndHaveEnoughMoney &&
          <AutoPaymentAlert
            onPay={this.onPay}
            cards={currentPlayer.placedCards}
            payee={payment.payee}
            dueAmount={payment.amount}
            sayNoButton={this.renderSayNoToPayeeButton()}
          />
        }

        {isPayee &&
          <PaymentInProgressAlert
            amount={payment.amount}
          />
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  paymentActions
)(GamePayment)
