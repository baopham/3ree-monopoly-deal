/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import CardOnHand from '../../components/CardOnHand'
import SlyDealForm from '../../components/SlyDealForm'
import ForcedDealForm from '../../components/ForcedDealForm'
import DealBreakerForm from '../../components/DealBreakerForm'
import { MAX_CARDS_IN_HAND, SLY_DEAL, FORCED_DEAL, DEAL_BREAKER } from '../../../../monopoly/cards'
import PropertySetClass from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'
import { isPlayerTurn, getCurrentPlayer, getOtherPlayers } from '../../modules/gameSelectors'
import { actions as cardsOnHandActions } from '../../modules/currentPlayerCardsOnHand'
import { actions as cardRequestActions } from '../../modules/cardRequest'

type Props = {
  currentPlayer: ?Player,
  otherPlayers: Player[],
  cardsOnHand: CardKey[],
  isPlayerTurn: boolean,
  placeCard: (card: CardKey) => void,
  playCard: (card: CardKey) => void,
  askToSlyDealSetCard: (otherPlayer: Player, fromSet: PropertySetClass, selectedCard: CardKey) => void,
  askToSlyDealLeftOverCard: (otherPlayer: Player, selectedCard: CardKey) => void,
  askToForceDealSetCard: (
    toPlayer: Player,
    toPlayerSetId: PropertySetId,
    toPlayerCard: CardKey,
    fromPlayerSetId: PropertySetId,
    fromPlayerCard: CardKey
  ) => void,
  askToForceDealLeftOverCard: (
    toPlayer: Player,
    toPlayerCard: CardKey,
    fromPlayerSetId: PropertySetId,
    fromPlayerCard: CardKey
  ) => void,
  askToDealBreak: (toPlayer: Player, setId: PropertySetId) => void,
  discardCard: (card: CardKey) => void,
  flipCardOnHand: (card: CardKey) => void
}

type State = {
  open: boolean,
  needsToDiscard: boolean,
  slyDealing: boolean,
  forceDealing: boolean,
  dealBreaker: boolean
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
  currentPlayer: getCurrentPlayer(state),
  otherPlayers: getOtherPlayers(state),
  cardsOnHand: state.currentPlayerCardsOnHand.cardsOnHand,
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
      forceDealing: false,
      dealBreaker: false
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

    if (card === DEAL_BREAKER) {
      this.setState({ dealBreaker: true })
      return
    }

    this.props.playCard(card)
  }

  onSlyDealSetCard = (playerToSlyDealFrom: Player, fromSet: PropertySetClass, selectedCard: CardKey) => {
    this.props.askToSlyDealSetCard(playerToSlyDealFrom, fromSet, selectedCard)
    this.props.discardCard(SLY_DEAL)
    this.onCancelSlyDealRequest()
  }

  onSlyDealLeftOverCard = (playerToSlyDealFrom: Player, selectedCard: CardKey) => {
    this.props.askToSlyDealLeftOverCard(playerToSlyDealFrom, selectedCard)
    this.props.discardCard(SLY_DEAL)
    this.onCancelSlyDealRequest()
  }

  onCancelSlyDealRequest = () => {
    this.setState({ slyDealing: false })
  }

  onForceDealSetCard = (
    toPlayer: Player,
    toPlayerSetId: PropertySetId,
    toPlayerCard: CardKey,
    fromPlayerSetId: PropertySetId,
    fromPlayerCard: CardKey
  ) => {
    this.props.askToForceDealSetCard(
      toPlayer,
      toPlayerSetId,
      toPlayerCard,
      fromPlayerSetId,
      fromPlayerCard
    )
    this.props.discardCard(FORCED_DEAL)
    this.onCancelForcedDealRequest()
  }

  onForceDealLeftOverCard = (
    toPlayer: Player,
    toPlayerCard: CardKey,
    fromPlayerSetId: PropertySetId,
    fromPlayerCard: CardKey
  ) => {
    this.props.askToForceDealLeftOverCard(
      toPlayer,
      toPlayerCard,
      fromPlayerSetId,
      fromPlayerCard
    )
    this.props.discardCard(FORCED_DEAL)
    this.onCancelForcedDealRequest()
  }

  onCancelForcedDealRequest = () => {
    this.setState({ forceDealing: false })
  }

  onDealBreakerSelect = (playerToDealBreakFrom: Player, setToDealBreak: PropertySetClass) => {
    this.props.askToDealBreak(playerToDealBreakFrom, setToDealBreak.getId())
    this.props.discardCard(DEAL_BREAKER)
    this.onCancelDealBreakerRequest()
  }

  onCancelDealBreakerRequest = () => {
    this.setState({ dealBreaker: false })
  }

  renderSlyDealForm = () => {
    const { otherPlayers } = this.props
    const propertySetFilter = (set: PropertySetClass) => !set.isFullSet()

    return (
      <SlyDealForm
        header='Select a card'
        subheader='Click to select a card to sly deal'
        players={otherPlayers}
        playerPropertySetFilter={propertySetFilter}
        onSetCardSelect={this.onSlyDealSetCard}
        onLeftOverCardSelect={this.onSlyDealLeftOverCard}
        onCancel={this.onCancelSlyDealRequest}
      />
    )
  }

  renderForcedDealForm = () => {
    const { currentPlayer, otherPlayers } = this.props
    const propertySetFilter = (set: PropertySetClass) => !set.isFullSet()

    return (
      <ForcedDealForm
        thisPlayer={currentPlayer}
        otherPlayers={otherPlayers}
        playerPropertySetFilter={propertySetFilter}
        onSetCardSelect={this.onForceDealSetCard}
        onLeftOverCardSelect={this.onForceDealLeftOverCard}
        onCancel={this.onCancelForcedDealRequest}
      />
    )
  }

  renderDealBreakerForm = () => {
    const { otherPlayers } = this.props

    return (
      <DealBreakerForm
        otherPlayers={otherPlayers}
        onSubmit={this.onDealBreakerSelect}
        onCancel={this.onCancelDealBreakerRequest}
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
      currentPlayer,
      placeCard,
      discardCard,
      flipCardOnHand,
      isPlayerTurn
    } = this.props

    const { needsToDiscard, slyDealing, forceDealing, dealBreaker } = this.state

    return (
      <Panel
        collapsible
        header={this.renderHeader()}
        expanded={this.state.open}
      >
        {currentPlayer &&
          <div>
            {needsToDiscard &&
              <Alert bsStyle='danger'>
                You have more then {MAX_CARDS_IN_HAND} cards! Please discard.
              </Alert>
            }
            {slyDealing &&
              this.renderSlyDealForm()
            }
            {forceDealing &&
              this.renderForcedDealForm()
            }
            {dealBreaker &&
              this.renderDealBreakerForm()
            }
            <ul className='list-inline' style={styles.cardsOnHand}>
              {cardsOnHand.map((card, i) =>
                <li key={i} style={styles.card}>
                  <CardOnHand
                    placedCards={currentPlayer.placedCards}
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
        }
      </Panel>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...cardsOnHandActions, ...cardRequestActions }
)(CardsOnHand)
