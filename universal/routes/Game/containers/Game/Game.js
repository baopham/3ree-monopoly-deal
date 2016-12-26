/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import FullWidth from '../../../../components/FullWidth'
import TextFormDialog from '../../../../components/TextFormDialog'
import CardsOnHand from '../../components/CardsOnHand'
import Board from '../../components/Board'
import PaymentForm from '../../components/PaymentForm'
import AutoPaymentAlert from '../../components/AutoPaymentAlert'
import PaymentInProgress from '../../components/PaymentInProgress'
import WinnerNotification from '../../components/WinnerNotification'
import { getCurrentPlayer, isPlayerTurn } from '../../modules/gameSelectors'
import { actions as gameActions } from '../../modules/currentGame'
import { actions as playerCardsActions } from '../../modules/currentPlayerCards'
import { actions as paymentActions } from '../../modules/payment'
import { MAX_NUMBER_OF_ACTIONS, getTotalMoneyFromPlacedCards } from '../../../../monopoly/monopoly'
import type { CurrentPlayerCardsState } from '../../modules/currentPlayerCards'
import type { PaymentState } from '../../modules/payment'

type Props = {
  game: Game,
  currentPlayer: Player,
  currentPlayerCards: CurrentPlayerCardsState,
  placeCard: (card: CardKey) => void,
  playCard: (card: CardKey) => void,
  drawCards: () => void,
  discardCard: (card: CardKey) => void,
  flipCardOnHand: (card: CardKey) => void,
  setWinner: (username: Username) => void,
  join: (username: Username) => void,
  pay: (payer: Username, moneyCards: CardKey[], serializedPropertySets: SerializedPropertySet[]) => void,
  endTurn: () => void,
  isPlayerTurn: boolean,
  payment: PaymentState
}

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  currentPlayerCards: state.currentPlayerCards,
  isPlayerTurn: isPlayerTurn(state),
  payment: state.payment
})

export class GameComponent extends React.Component {
  props: Props

  componentWillReceiveProps (nextProps: Props) {
    if (!this.props.currentPlayer || !nextProps.currentPlayer) {
      return
    }

    if (this.props.currentPlayer.actionCounter === nextProps.currentPlayer.actionCounter) {
      return
    }

    if (nextProps.currentPlayer.actionCounter === MAX_NUMBER_OF_ACTIONS) {
      this.props.endTurn()
    }
  }

  onPay = (moneyCards: CardKey[], serializedPropertySets: SerializedPropertySet[]) => {
    const { pay, currentPlayer } = this.props
    pay(currentPlayer.username, moneyCards, serializedPropertySets)
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
    const {
      game,
      currentPlayer,
      join,
      currentPlayerCards,
      drawCards,
      placeCard,
      playCard,
      endTurn,
      discardCard,
      flipCardOnHand,
      isPlayerTurn,
      setWinner,
      payment
    } = this.props

    const isPayee = this.isPayee()
    const needToPay = this.needToPay()
    const needToPayAndHaveEnoughMoney = needToPay && !this.payerHasNotEnoughMoney()
    const gameHasAWinner = currentPlayer && !!game.winner

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>

        {currentPlayer &&
          <div>
            <CardsOnHand
              cardsOnHand={currentPlayerCards.cardsOnHand}
              placedCards={currentPlayer.placedCards}
              onPlaceCard={placeCard}
              onPlayCard={playCard}
              onDrawCards={drawCards}
              onDiscardCard={discardCard}
              onFlipCard={flipCardOnHand}
              currentPlayer={currentPlayer}
              isPlayerTurn={isPlayerTurn}
            />

            <Board
              game={game}
              onEndTurn={endTurn}
              onDrawCards={drawCards}
              onWinning={setWinner}
              isPlayerTurn={isPlayerTurn}
              currentPlayer={currentPlayer}
            />
          </div>
        }

        {!currentPlayer &&
          <TextFormDialog
            header='Join Game'
            inputLabel='Username'
            submitLabel='Join'
            onSubmit={join}
          />
        }

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

        {gameHasAWinner &&
          <WinnerNotification
            winner={game.winner}
            hasWon={currentPlayer.username === game.winner}
          />
        }
      </FullWidth>
    )
  }
}

export default connect(
  mapStateToProps,
  {
    ...gameActions,
    ...playerCardsActions,
    ...paymentActions
  }
)(GameComponent)
