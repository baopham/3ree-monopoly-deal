import React, { PropTypes } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Container from '../../../../components/Container'
import DrawPile from '../DrawPile'
import DiscardPile from '../DiscardPile'
import Members from '../Members'

export default class Board extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  }

  render () {
    const { game } = this.props

    return (
      <Container fluid>
        <Col md={2}>
          <DrawPile cards={game.availableCards} />
          <DiscardPile cards={game.discardedCards} />
        </Col>

        <Col md={10}>
          <Members members={game.members} />
        </Col>
      </Container>
    )
  }
}

