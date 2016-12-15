import React, { PropTypes } from 'react'
import CardPile from '../CardPile'
import PropertySet from '../PropertySet'
import { Panel, Col } from 'react-bootstrap'
import Container from '../../../../components/Container'
import { hasEnoughFullSetsToWin, groupPropertiesIntoSets } from '../../../../monopoly/monopoly'

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
    cards: PropTypes.object,
    onWinning: PropTypes.func.isRequired
  }

  static defaultProps = {
    cards: {
      bank: [],
      properties: []
    }
  }

  constructor (...args) {
    super(...args)

    this.propertySets = groupPropertiesIntoSets(this.props.cards.properties)
  }

  componentWillUpdate (nextProps) {
    this.propertySets = groupPropertiesIntoSets(nextProps.cards.properties)

    if (hasEnoughFullSetsToWin(this.propertySets)) {
      this.props.onWinning()
    }
  }

  componentWillUnmount () {
    this.propertySets = null
  }

  render () {
    const { cards } = this.props
    const { bank } = cards

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
              {this.propertySets.map((set, i) =>
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
