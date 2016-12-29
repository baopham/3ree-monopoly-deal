/* @flow */
import React from 'react'
import CardPile from '../CardPile'
import PlacedPropertySets from '../PlacedPropertySets'
import { Panel, Col } from 'react-bootstrap'
import Container from '../../../../components/Container'
import * as monopoly from '../../../../monopoly/monopoly'
import PropertySetType from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  cards: PlacedCards,
  immutable: boolean,
  onWinning: () => void,
  onFlipCard: (card: CardKey, propertySetId: PropertySetId) => void,
  onMoveCard: (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) => void
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
    const { cards, immutable, onWinning, onMoveCard, onFlipCard } = this.props
    const { bank, serializedPropertySets } = cards
    const propertySets: PropertySetType[] = serializedPropertySets.map(monopoly.unserializePropertySet)

    return (
      <Container fluid>
        <Col md={2}>
          <Panel header='Bank' style={styles.bank}>
            <CardPile cards={bank} size='small' faceUp />
          </Panel>
        </Col>

        <Col md={10}>
          <Panel header='Properties' style={styles.properties}>
            <PlacedPropertySets
              immutable={immutable}
              propertySets={propertySets}
              onFlipCard={onFlipCard}
              onMoveCard={onMoveCard}
              onWinning={onWinning}
            />
          </Panel>
        </Col>
      </Container>
    )
  }
}
