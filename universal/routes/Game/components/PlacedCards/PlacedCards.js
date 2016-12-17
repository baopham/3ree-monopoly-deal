import React, { PropTypes } from 'react'
import CardPile from '../CardPile'
import Properties from '../Properties'
import { Panel, Col } from 'react-bootstrap'
import Container from '../../../../components/Container'

const styles = {
  properties: {
    minHeight: 310
  },
  bank: {
    minHeight: 310
  }
}

export default class PlacedCards extends React.Component {
  static propTypes = {
    cards: PropTypes.shape({
      bank: PropTypes.arrayOf(PropTypes.string),
      properties: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onWinning: PropTypes.func.isRequired
  }

  render () {
    const { cards, onWinning } = this.props
    const { bank, properties } = cards

    return (
      <Container fluid>
        <Col md={2}>
          <Panel header='Bank' style={styles.bank}>
            <CardPile cards={bank} size='small' faceUp />
          </Panel>
        </Col>

        <Col md={10}>
          <Panel header='Properties' style={styles.properties}>
            <Properties
              properties={properties}
              onWinning={onWinning}
            />
          </Panel>
        </Col>
      </Container>
    )
  }
}
