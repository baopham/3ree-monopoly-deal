import React, { PropTypes } from 'react'
import CardPile from '../CardPile'
import PropertySet from '../PropertySet'
import { Panel, Col } from 'react-bootstrap'
import Container from '../../../../components/Container'
import { groupPropertiesIntoSets } from '../../../../monopoly/monopoly'

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
    const propertySets = groupPropertiesIntoSets(properties)

    return (
      <Container fluid>
        <Col md={2}>
          <Panel header='Bank' style={styles.bank}>
            <CardPile cards={bank} size='small' faceUp />
          </Panel>
        </Col>

        <Col md={10}>
          <Panel header='Properties' style={styles.properties}>
            <ul className='list-inline'>
              {propertySets.map((set, i) =>
                <li key={i}>
                  <PropertySet
                    propertySet={set}
                   />
                </li>
              )}
            </ul>
          </Panel>
        </Col>
      </Container>
    )
  }
}

