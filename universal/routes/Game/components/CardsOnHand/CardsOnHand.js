import React, { PropTypes } from 'react'
import { Panel, Glyphicon } from 'react-bootstrap'
import FullWidth from '../../../../components/FullWidth'
import CardOnHand from '../CardOnHand'

export default class CardsOnHand extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    onPlaceCard: PropTypes.func,
    onPlayCard: PropTypes.func,
    onDrawCards: PropTypes.func,
    isPlayerTurn: PropTypes.bool
  }

  static defaultProps = {
    cards: [],
    onPlaceCard: () => {},
    onPlayCard: () => {}
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
    const {
      cards,
      onPlaceCard,
      onPlayCard,
      onDrawCards,
      isPlayerTurn
    } = this.props

    return (
      <FullWidth fluid>
        <Panel
          header={this.renderHeader()}
          collapsible
          expanded={this.state.open}
          onClick={this.togglePanel}
        >
          <ul className="list-inline" style={{ minHeight: 250 }}>
            {cards.map((card, i) =>
              <li key={i}>
                <CardOnHand
                  cards={cards}
                  card={card}
                  onPlaceCard={onPlaceCard}
                  onPlayCard={onPlayCard}
                  onDrawCards={onDrawCards}
                  isPlayerTurn={isPlayerTurn}
                />
              </li>
            )}
          </ul>
        </Panel>
      </FullWidth>
    )
  }
}

