import React, { PropTypes } from 'react'
import { Panel, Glyphicon } from 'react-bootstrap'
import FullWidth from '../../../../components/FullWidth'
import CardOnHand from '../CardOnHand'

export default class CardsOnHand extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    onPlaceCard: PropTypes.func
  }

  static defaultProps = {
    cards: [],
    onPlaceCard: () => {}
  }

  constructor(...args) {
    super(...args)

    this.state = {
      open: true
    }
  }

  togglePanel = () => {
    this.setState({
      open: !this.state.open
    })
  }

  renderHeader () {
    return (
      <span>
        {this.state.open &&
          <Glyphicon glyph="chevron-up" />
        }
        {!this.state.open &&
          <Glyphicon glyph="chevron-down" />
        }
        {' '}
        Hand
      </span>
    )
  }

  render () {
    const { cards, onPlaceCard } = this.props

    return (
      <FullWidth fluid>
        <Panel
          header={this.renderHeader()}
          collapsible
          expanded={this.state.open}
          onClick={this.togglePanel}
        >
          <ul className="list-inline">
            {cards.map((card, i) =>
              <li key={i}>
                <CardOnHand
                  card={card}
                  onPlaceCard={onPlaceCard}
                />
              </li>
            )}
          </ul>
        </Panel>
      </FullWidth>
    )
  }
}

