/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import CardOnHand from '../../components/CardOnHand'
import OtherPlayerPropertyCardSelector from '../../components/OtherPlayerPropertyCardSelector'
import { MAX_CARDS_IN_HAND, SLY_DEAL } from '../../../../monopoly/cards'
import PropertySetType from '../../../../monopoly/PropertySet'
import { isPlayerTurn, getCurrentPlayer, getOtherPlayers } from '../../modules/gameSelectors'
import { actions as cardsOnHandActions } from '../../modules/currentPlayerCardsOnHand'
import { actions as cardRequestActions } from '../../modules/cardRequest'

type Props = {
  otherPlayers: Player[],
  cardsOnHand: CardKey[],
  placedCards: PlacedCards,
  isPlayerTurn: boolean,
  placeCard: (card: CardKey) => void,
  playCard: (card: CardKey) => void,
  askToSlyDeal: (otherPlayer: Player, fromSet: PropertySetType, selectedCard: CardKey) => void,
  discardCard: (card: CardKey) => void,
  flipCardOnHand: (card: CardKey) => void
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

const mapStateToProps = (state) => ({
  otherPlayers: getOtherPlayers(state),
  cardsOnHand: state.currentPlayerCardsOnHand.cardsOnHand,
  placedCards: getCurrentPlayer(state).placedCards,
  isPlayerTurn: isPlayerTurn(state)
})

export class CardsOnHand extends React.Component {
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

    this.props.playCard(card)
  }

  onSlyDeal = (fromPlayer: Player, fromSet: PropertySetType, selectedCard: CardKey) => {
    this.props.askToSlyDeal(fromPlayer, fromSet, selectedCard)
    this.props.discardCard(SLY_DEAL)
    this.onCancelSlyDealRequest()
  }

  onCancelSlyDealRequest = () => {
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
        onCancel={this.onCancelSlyDealRequest}
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
      placeCard,
      discardCard,
      flipCardOnHand,
      isPlayerTurn
    } = this.props

    const { needsToDiscard, slyDealing } = this.state

    return (
      <Panel
        collapsible
        header={this.renderHeader()}
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
                  onPlaceCard={placeCard}
                  onPlayCard={this.onPlayCard}
                  onDiscardCard={discardCard}
                  onFlipCard={flipCardOnHand}
                />
              </li>
            )}
          </ul>
        </div>
      </Panel>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...cardsOnHandActions, ...cardRequestActions }
)(CardsOnHand)
