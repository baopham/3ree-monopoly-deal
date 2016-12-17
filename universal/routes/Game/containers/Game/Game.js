import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FullWidth from '../../../../components/FullWidth'
import JoinForm from '../../components/JoinForm'
import CardsOnHand from '../../components/CardsOnHand'
import Board from '../../components/Board'
import PaymentForm from '../../components/PaymentForm'
import { getCurrentPlayer, isPlayerTurn, getRequiredPayment } from '../../modules/gameSelectors'
import { actions as gameActions } from '../../modules/currentGame'
import { actions as playerCardsActions } from '../../modules/currentPlayerCards'
import { actions as paymentActions } from '../../modules/payment'
import { MAX_NUMBER_OF_ACTIONS } from '../../../../monopoly/monopoly'

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  currentPlayerCards: state.currentPlayerCards,
  isPlayerTurn: isPlayerTurn(state),
  requiredPayment: getRequiredPayment(state)
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
    join: PropTypes.func.isRequired,
    pay: PropTypes.func.isRequired,
    endTurn: PropTypes.func.isRequired,
    isPlayerTurn: PropTypes.bool,
    requiredPayment: PropTypes.object
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

  onWinning = () => {
    // TODO
    alert('YOU WIN')
  }

  onPay = (cardsForPayment) => {
    const { pay, currentPlayer } = this.props
    pay(currentPlayer.username, cardsForPayment)
  }

  render () {
    // TODO: handle when player does not have enough to pay -> take all their cards?
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
      requiredPayment
    } = this.props

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>

        {currentPlayer &&
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
        }

        {currentPlayer &&
          <Board
            game={game}
            onEndTurn={endTurn}
            onDrawCards={drawCards}
            onWinning={this.onWinning}
            isPlayerTurn={isPlayerTurn}
            currentPlayer={currentPlayer}
          />
        }

        {requiredPayment &&
          <PaymentForm
            onPay={this.onPay}
            cards={currentPlayer.placedCards}
            payee={requiredPayment.payee}
            dueAmount={requiredPayment.amount}
          />
        }

        {!currentPlayer &&
          <JoinForm onJoin={join} />
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
