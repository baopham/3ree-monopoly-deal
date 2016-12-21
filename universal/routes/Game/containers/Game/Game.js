import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FullWidth from '../../../../components/FullWidth'
import JoinForm from '../../components/JoinForm'
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
import { MAX_NUMBER_OF_ACTIONS, getTotalCardValue } from '../../../../monopoly/monopoly'

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  currentPlayerCards: state.currentPlayerCards,
  isPlayerTurn: isPlayerTurn(state),
  payment: state.payment
})

export class Game extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    currentPlayer: PropTypes.object,
    currentPlayerCards: PropTypes.object,
    placeCard: PropTypes.func.isRequired,
    playCard: PropTypes.func.isRequired,
    drawCards: PropTypes.func.isRequired,
    discardCard: PropTypes.func.isRequired,
    flipCard: PropTypes.func.isRequired,
    setWinner: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired,
    pay: PropTypes.func.isRequired,
    endTurn: PropTypes.func.isRequired,
    isPlayerTurn: PropTypes.bool,
    payment: PropTypes.object.isRequired
  }

  componentWillReceiveProps (nextProps) {
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

  onPay = (cardsForPayment) => {
    const { pay, currentPlayer } = this.props
    pay(currentPlayer.username, cardsForPayment)
  }

  payerHasNotEnoughMoney () {
    const { currentPlayer, payment } = this.props
    const { placedCards } = currentPlayer
    const totalAmount = getTotalCardValue(placedCards.bank) + getTotalCardValue(placedCards.properties)
    return totalAmount > 0 && totalAmount <= payment.amount
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
      flipCard,
      isPlayerTurn,
      setWinner,
      payment
    } = this.props

    const isPayee = currentPlayer && payment.amount && payment.payee === currentPlayer.username
    const needToPay = currentPlayer && !isPayee && payment.payers && payment.payers.includes(currentPlayer.username)
    const needToPayButNotEnoughMoney = needToPay && this.payerHasNotEnoughMoney()
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
              onFlipCard={flipCard}
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
          <JoinForm onJoin={join} />
        }

        {needToPay && !needToPayButNotEnoughMoney &&
          <PaymentForm
            onPay={this.onPay}
            cards={currentPlayer.placedCards}
            payee={payment.payee}
            dueAmount={payment.amount}
          />
        }

        {needToPayButNotEnoughMoney &&
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
)(Game)
