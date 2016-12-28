/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import FullWidth from '../../../../components/FullWidth'
import TextFormDialog from '../../../../components/TextFormDialog'
import Container from '../../../../components/Container'
import GameHistoryLog from '../GameHistoryLog'
import GamePayment from '../GamePayment'
import CardsOnHand from '../../components/CardsOnHand'
import Board from '../../components/Board'
import WinnerNotification from '../../components/WinnerNotification'
import { getCurrentPlayer, isPlayerTurn } from '../../modules/gameSelectors'
import { actions as gameActions } from '../../modules/currentGame'
import { actions as playerCardsActions } from '../../modules/currentPlayerCards'
import { MAX_NUMBER_OF_ACTIONS } from '../../../../monopoly/monopoly'
import type { CurrentPlayerCardsState } from '../../modules/currentPlayerCards'

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
  endTurn: () => void,
  isPlayerTurn: boolean
}

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  currentPlayerCards: state.currentPlayerCards,
  isPlayerTurn: isPlayerTurn(state)
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
      setWinner
    } = this.props

    const gameHasAWinner = currentPlayer && !!game.winner

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>

        {currentPlayer &&
          <div>
            <Container fluid>
              <Col md={3}>
                <GameHistoryLog />
              </Col>
              <Col md={9}>
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
              </Col>
            </Container>

            <Board
              game={game}
              onEndTurn={endTurn}
              onDrawCards={drawCards}
              onWinning={setWinner}
              isPlayerTurn={isPlayerTurn}
              currentPlayer={currentPlayer}
            />

            <GamePayment />
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
    ...playerCardsActions
  }
)(GameComponent)
