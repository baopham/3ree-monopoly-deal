import React, { PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import DrawCardsButton from '../DrawCardsButton'
import EndTurnButton from '../EndTurnButton'
import Container from '../../../../components/Container'
import DrawPile from '../DrawPile'
import DiscardPile from '../DiscardPile'
import Players from '../Players'

export default class Board extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    onEndTurn: PropTypes.func.isRequired,
    onDrawCards: PropTypes.func.isRequired,
    isPlayerTurn: PropTypes.bool
  }

  render () {
    const {
      game,
      isPlayerTurn,
      onEndTurn,
      onDrawCards
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
          <DiscardPile cards={game.discardedCards} />
        </Col>

        <Col md={10}>
          <Players players={game.players} />
        </Col>
      </Container>
    )
  }
}

