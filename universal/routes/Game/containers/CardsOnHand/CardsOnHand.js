/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import CardOnHand from '../../components/CardOnHand'
import MultiplePlayerPropertyCardSelectorForm from '../../components/MultiplePlayerPropertyCardSelectorForm'
import { MAX_CARDS_IN_HAND, SLY_DEAL, FORCED_DEAL } from '../../../../monopoly/cards'
import PropertySetClass from '../../../../monopoly/PropertySet'
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
  askToSlyDeal: (otherPlayer: Player, fromSet: PropertySetClass, selectedCard: CardKey) => void,
  discardCard: (card: CardKey) => void,
  flipCardOnHand: (card: CardKey) => void
}

type State = {
  open: boolean,
  needsToDiscard: boolean,
  slyDealing: boolean,
  forceDealing: boolean
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
      slyDealing: false,
      forceDealing: false
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

    if (card === FORCED_DEAL) {
      this.setState({ forceDealing: true })
      return
    }

    this.props.playCard(card)
  }

  onSlyDeal = (playerToSlyDealFrom: Player, fromSet: PropertySetClass, selectedCard: CardKey) => {
    this.props.askToSlyDeal(playerToSlyDealFrom, fromSet, selectedCard)
    this.props.discardCard(SLY_DEAL)
    this.onCancelSlyDealRequest()
  }

  onCancelSlyDealRequest = () => {
    this.setState({ slyDealing: false })
  }

  onForceDeal = (playerToForceDealFrom: Player) => {
    // TODO
  }

  onCancelForceDealRequest= () => {
    this.setState({ forceDealing: false })
  }

  renderSlyDealForm = () => {
    const { otherPlayers } = this.props
    const propertySetFilter = (set: PropertySetClass) => !set.isFullSet()

    return (
      <MultiplePlayerPropertyCardSelectorForm
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
            this.renderSlyDealForm()
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
