import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import DrawCardsButton from '../DrawCardsButton'
import EndTurnButton from '../EndTurnButton'
import Container from '../../../../components/Container'
import DrawPile from '../../components/DrawPile'
import DiscardPile from '../../components/DiscardPile'
import Members from '../../components/Members'

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
})

export class Board extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  }

  render () {
    const { game } = this.props

    return (
      <Container fluid>
        <Col md={2}>
          <DrawPile
            cards={game.availableCards}
            drawCardsButton={<DrawCardsButton />}
            endTurnButton={<EndTurnButton />}
          />
          <DiscardPile cards={game.discardedCards} />
        </Col>

        <Col md={10}>
          <Members members={game.members} />
        </Col>
      </Container>
    )
  }
}

export default connect(
  mapStateToProps
)(Board)
