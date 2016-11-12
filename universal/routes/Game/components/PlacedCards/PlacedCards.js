import React, { PropTypes } from 'react'
import Card from '../Card'
import CardPile from '../CardPile'
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
    cards: PropTypes.object
  }

  static defaultProps = {
    cards: {
      bank: [],
      properties: []
    }
  }

  render () {
    const { cards } = this.props
    const { bank, properties } = cards

    return (
      <Container fluid>
        <Col md={2}>
          <Panel header="Bank" style={styles.bank}>
            <CardPile card={bank} size="small" faceUp />
          </Panel>
        </Col>

        <Col md={10}>
          <Panel header="Properties" style={styles.properties}>
            {properties.map((card, i) =>
              <Card card={card} key={i} size="small" faceUp />
            )}
          </Panel>
        </Col>
      </Container>
    )
  }
}

