/* @flow */
import React from 'react'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import CardOnHand from '../CardOnHand'
import { MAX_CARDS_IN_HAND } from '../../../../monopoly/cards'

type Props = {
  cardsOnHand: CardKey[],
  placedCards: PlacedCards,
  onPlaceCard: (card: CardKey) => void,
  onPlayCard: (card: CardKey) => void,
  onDrawCards: () => void,
  onDiscardCard: (card: CardKey) => void,
  onFlipCard: (card: CardKey) => void,
  isPlayerTurn: boolean
}

type State = {
  open: boolean,
  needsToDiscard: boolean
}

const styles = {
  cardsOnHand: {
    minHeight: 250
  },
  card: {
    marginBottom: 20
  }
}

export default class CardsOnHand extends React.Component {
  props: Props

  state: State

  constructor (props: Props) {
    super(props)

    this.state = {
      open: true,
      needsToDiscard: this.props.cardsOnHand.length > MAX_CARDS_IN_HAND
    }
  }

  componentWillReceiveProps (nextProps: Props) {
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
      <div>
        {this.state.open &&
          <Glyphicon glyph='chevron-up' />
        }
        {!this.state.open &&
          <Glyphicon glyph='chevron-down' />
        }
        {' '}
        Hand
      </div>
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
    )
  }
}
