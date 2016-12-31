/* @flow */
import React from 'react'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import CardOnHand from '../CardOnHand'
import OtherPlayerPropertyCardSelector from '../OtherPlayerPropertyCardSelector'
import { MAX_CARDS_IN_HAND, SLY_DEAL } from '../../../../monopoly/cards'
import PropertySetType from '../../../../monopoly/PropertySet'

type Props = {
  otherPlayers: Player[],
  cardsOnHand: CardKey[],
  placedCards: PlacedCards,
  isPlayerTurn: boolean,
  onPlaceCard: (card: CardKey) => void,
  onPlayCard: (card: CardKey) => void,
  onSlyDeal: (fromPlayer: Player, fromSet: PropertySetType, selectedCard: CardKey) => void,
  onDiscardCard: (card: CardKey) => void,
  onFlipCard: (card: CardKey) => void
}

type State = {
  open: boolean,
  needsToDiscard: boolean,
  slyDealing: boolean
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
      needsToDiscard: this.props.cardsOnHand.length > MAX_CARDS_IN_HAND,
      slyDealing: false
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

  onPlayCard = (card: CardKey) => {
    if (card === SLY_DEAL) {
      this.setState({ slyDealing: true })
      return
    }

    this.props.onPlayCard(card)
  }

  onSlyDeal = (fromPlayer: Player, fromSet: PropertySetType, selectedCard: CardKey) => {
    this.props.onSlyDeal(fromPlayer, fromSet, selectedCard)
    this.onCancelSlyDealing()
  }

  onCancelSlyDealing = () => {
    this.setState({ slyDealing: false })
  }

  renderOtherPlayerCardSelectorForSlyDealing = () => {
    const { otherPlayers } = this.props
    const propertySetFilter = (set: PropertySetType) => !set.isFullSet()

    return (
      <OtherPlayerPropertyCardSelector
        header='Select a card'
        subheader='Click to select a card to sly deal'
        players={otherPlayers}
        playerPropertySetFilter={propertySetFilter}
        onSelect={this.onSlyDeal}
        onCancel={this.onCancelSlyDealing}
      />
    )
  }

  renderHeader () {
    return (
      <div onClick={this.togglePanel}>
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
      onDiscardCard,
      onFlipCard,
      isPlayerTurn
    } = this.props

    const { needsToDiscard, slyDealing } = this.state

    return (
      <Panel
        header={this.renderHeader()}
        collapsible
        expanded={this.state.open}
      >
        <div>
          {needsToDiscard &&
            <Alert bsStyle='danger'>
              You have more then {MAX_CARDS_IN_HAND} cards! Please discard.
            </Alert>
          }
          {slyDealing &&
            this.renderOtherPlayerCardSelectorForSlyDealing()
          }
          <ul className='list-inline' style={styles.cardsOnHand}>
            {cardsOnHand.map((card, i) =>
              <li key={i} style={styles.card}>
                <CardOnHand
                  placedCards={placedCards}
                  card={card}
                  needsToDiscard={this.state.needsToDiscard}
                  isPlayerTurn={isPlayerTurn}
                  onPlaceCard={onPlaceCard}
                  onPlayCard={this.onPlayCard}
                  onDiscardCard={onDiscardCard}
                  onFlipCard={onFlipCard}
                />
              </li>
            )}
          </ul>
        </div>
      </Panel>
    )
  }
}
