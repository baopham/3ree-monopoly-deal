/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import DrawCardsButton from '../../components/DrawCardsButton'
import EndTurnButton from '../../components/EndTurnButton'
import Container from '../../../../components/Container'
import DrawPile from '../../components/DrawPile'
import DiscardPile from '../../components/DiscardPile'
import Players from '../../components/Players'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import { getCurrentPlayer, isPlayerTurn } from '../../modules/gameSelectors'
import { actions as gameActions } from '../../modules/currentGame'
import { actions as playerCardsActions } from '../../modules/currentPlayerCardsOnHand'

type Props = {
  game: Game,
  currentPlayer: Player,
  isPlayerTurn: boolean,
  endTurn: () => void,
  drawCards: () => void,
  setWinner: (username: Username) => void,
  flipPlacedCard: (card: CardKey, propertySetId: PropertySetId) => void,
  moveCard: (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) => void
}

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  isPlayerTurn: isPlayerTurn(state)
})

export class Board extends React.Component {
  props: Props

  render () {
    const {
      game,
      isPlayerTurn,
      endTurn,
      currentPlayer,
      drawCards,
      flipPlacedCard,
      moveCard,
      setWinner
    } = this.props

    const drawCardsButton = (
      <DrawCardsButton
        isPlayerTurn={isPlayerTurn}
        onDrawCards={drawCards}
      />
    )

    const endTurnButton = (
      <EndTurnButton
        isPlayerTurn={isPlayerTurn}
        onEndTurn={endTurn}
      />
    )

    return (
      <Container fluid>
        <Col md={2}>
          <DrawPile
            cards={game.availableCards}
            drawCardsButton={drawCardsButton}
            endTurnButton={endTurnButton}
          />
          <DiscardPile
            lastCardPlayedBy={game.lastCardPlayedBy}
            cards={game.discardedCards}
          />
        </Col>

        <Col md={10}>
          <Players
            currentPlayer={currentPlayer}
            isPlayerTurn={isPlayerTurn}
            players={game.players}
            onWinning={setWinner}
            onFlipCard={flipPlacedCard}
            onMoveCard={moveCard}
          />
        </Col>
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...gameActions, ...playerCardsActions }
)(Board)
