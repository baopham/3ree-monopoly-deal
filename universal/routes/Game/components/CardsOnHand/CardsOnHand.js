import React, { PropTypes } from 'react'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import FullWidth from '../../../../components/FullWidth'
import CardOnHand from '../CardOnHand'
import { MAX_CARDS_IN_HAND } from '../../../../monopoly/cards'

const styles = {
  cardsOnHand: {
    minHeight: 250
  },
  card: {
    marginBottom: 20
  }
}

export default class CardsOnHand extends React.Component {
  static propTypes = {
    cardsOnHand: PropTypes.array.isRequired,
    placedCards: PropTypes.object.isRequired,
    onPlaceCard: PropTypes.func.isRequired,
    onPlayCard: PropTypes.func.isRequired,
    onDrawCards: PropTypes.func.isRequired,
    onDiscardCard: PropTypes.func.isRequired,
    onFlipCard: PropTypes.func.isRequired,
    isPlayerTurn: PropTypes.bool
  }

  constructor (...args) {
    super(...args)

    this.state = {
      open: true,
      needsToDiscard: this.props.cardsOnHand.length > MAX_CARDS_IN_HAND
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      needsToDiscard: nextProps.cardsOnHand.length > MAX_CARDS_IN_HAND
    })
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
          <Glyphicon glyph='chevron-up' />
        }
        {!this.state.open &&
          <Glyphicon glyph='chevron-down' />
        }
        {' '}
        Hand
      </span>
    )
  }

  render () {
    const {
      cardsOnHand,
      placedCards,
      onPlaceCard,
      onPlayCard,
      onDrawCards,
      onDiscardCard,
      onFlipCard,
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
          <div>
            {this.state.needsToDiscard &&
              <Alert bsStyle='danger'>
                You have more then {MAX_CARDS_IN_HAND} cards! Please discard.
              </Alert>
            }
            <ul className='list-inline' style={styles.cardsOnHand}>
              {cardsOnHand.map((card, i) =>
                <li key={i} style={styles.card}>
                  <CardOnHand
                    placedCards={placedCards}
                    card={card}
                    onPlaceCard={onPlaceCard}
                    onPlayCard={onPlayCard}
                    onDrawCards={onDrawCards}
                    onDiscardCard={onDiscardCard}
                    onFlipCard={onFlipCard}
                    needsToDiscard={this.state.needsToDiscard}
                    isPlayerTurn={isPlayerTurn}
                  />
                </li>
              )}
            </ul>
          </div>
        </Panel>
      </FullWidth>
    )
  }
}

