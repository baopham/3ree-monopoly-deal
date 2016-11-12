import React, { PropTypes } from 'react'
import { Panel, Glyphicon } from 'react-bootstrap'
import Card from '../Card'
import FullWidth from '../../../../components/FullWidth'

export default class CardsOnHand extends React.Component {
  static propTypes = {
    cards: PropTypes.array
  }

  static defaultProps = {
    cards: []
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
    const { cards } = this.props

    return (
      <FullWidth fluid>
        <Panel header={this.renderHeader()} collapsible onClick={this.togglePanel}>
          <ul className="list-inline">
            {cards.map((card, i) => 
              <li key={i}>
                <Card card={card} faceUp />
              </li>
            )}
          </ul>
        </Panel>
      </FullWidth>
    )
  }
}

