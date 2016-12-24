/* @flow */
import React from 'react'
import { Col } from 'react-bootstrap'
import DrawCardsButton from '../DrawCardsButton'
import EndTurnButton from '../EndTurnButton'
import Container from '../../../../components/Container'
import DrawPile from '../DrawPile'
import DiscardPile from '../DiscardPile'
import Players from '../Players'

type Props = {
  game: Game,
  onEndTurn: () => void,
  onDrawCards: () => void,
  onWinning: (username: Username) => void,
  currentPlayer: Player,
  isPlayerTurn: boolean
}

export default class Board extends React.Component {
  props: Props

  render () {
    const {
      game,
      isPlayerTurn,
      onEndTurn,
      currentPlayer,
      onDrawCards,
      onWinning
    } = this.props

    const drawCardsButton = (
      <DrawCardsButton
        isPlayerTurn={isPlayerTurn}
        onDrawCards={onDrawCards}
      />
    )

    const endTurnButton = (
      <EndTurnButton
        isPlayerTurn={isPlayerTurn}
        onEndTurn={onEndTurn}
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
            players={game.players}
            onWinning={onWinning}
          />
        </Col>
      </Container>
    )
  }
}
