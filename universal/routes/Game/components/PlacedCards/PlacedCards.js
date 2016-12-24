/* @flow */
import React from 'react'
import CardPile from '../CardPile'
import Properties from '../Properties'
import { Panel, Col } from 'react-bootstrap'
import Container from '../../../../components/Container'

type Props = {
  cards: PlacedCards,
  onWinning: () => void
}

const styles = {
  properties: {
    minHeight: 310
  },
  bank: {
    minHeight: 310
  }
}

export default class PlacedCardsComponent extends React.Component {
  props: Props

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
