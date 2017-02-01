/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Panel, Glyphicon, Alert } from 'react-bootstrap'
import CardOnHand from '../../components/CardOnHand'
import SlyDealForm from '../../components/SlyDealForm'
import ForcedDealForm from '../../components/ForcedDealForm'
import DealBreakerForm from '../../components/DealBreakerForm'
import PlayerSelectorForm from '../../components/PlayerSelectorForm'
import {
  MAX_CARDS_IN_HAND,
  SLY_DEAL,
  FORCED_DEAL,
  DEAL_BREAKER,
  RENT_ALL_COLOUR
} from '../../../../monopoly/cards'
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
  flipCardOnHand: (card: CardKey) => void,
  targetRent: (player: Player) => void
}

type State = {
  open: boolean,
  needsToDiscard: boolean,
  slyDealing: boolean,
  forceDealing: boolean,
  dealBreaker: boolean,
  playingTargetRent: boolean
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
      dealBreaker: false,
      playingTargetRent: false
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

    if (card === RENT_ALL_COLOUR) {
      this.setState({ playingTargetRent: true })
      return
    }

    this.props.playCard(card)
  }

  renderSlyDealForm = () => {
    const { otherPlayers } = this.props
    const propertySetFilter = (set: PropertySetClass) => !set.isFullSet()

    const cancelSlyDealRequest = () => this.setState({ slyDealing: false })

    const startSlyDealSetCard = (playerToSlyDealFrom: Player, fromSet: PropertySetClass, selectedCard: CardKey) => {
      this.props.askToSlyDealSetCard(playerToSlyDealFrom, fromSet, selectedCard)
      cancelSlyDealRequest()
    }

    const startSlyDealLeftOverCard = (playerToSlyDealFrom: Player, selectedCard: CardKey) => {
      this.props.askToSlyDealLeftOverCard(playerToSlyDealFrom, selectedCard)
      cancelSlyDealRequest()
    }

    return (
      <SlyDealForm
        header='Select a card'
        subheader='Click to select a card to sly deal'
        players={otherPlayers}
        playerPropertySetFilter={propertySetFilter}
        onSetCardSelect={startSlyDealSetCard}
        onLeftOverCardSelect={startSlyDealLeftOverCard}
        onCancel={cancelSlyDealRequest}
      />
    )
  }

  renderForcedDealForm = () => {
    const { currentPlayer, otherPlayers } = this.props
    const propertySetFilter = (set: PropertySetClass) => !set.isFullSet()

    const cancelForcedDealRequest = () => this.setState({ forceDealing: false })

    const startForceDealSetCard = (
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
      cancelForcedDealRequest()
    }

    const startForceDealLeftOverCard = (
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
      cancelForcedDealRequest()
    }

    return (
      <ForcedDealForm
        thisPlayer={currentPlayer}
        otherPlayers={otherPlayers}
        playerPropertySetFilter={propertySetFilter}
        onSetCardSelect={startForceDealSetCard}
        onLeftOverCardSelect={startForceDealLeftOverCard}
        onCancel={cancelForcedDealRequest}
      />
    )
  }

  renderDealBreakerForm = () => {
    const { otherPlayers } = this.props

    const cancelDealBreaker = () => this.setState({ dealBreaker: false })

    const startDealBreaker = (playerToDealBreakFrom: Player, setToDealBreak: PropertySetClass) => {
      this.props.askToDealBreak(playerToDealBreakFrom, setToDealBreak.getId())
      cancelDealBreaker()
    }

    return (
      <DealBreakerForm
        otherPlayers={otherPlayers}
        onSubmit={startDealBreaker}
        onCancel={cancelDealBreaker}
      />
    )
  }

  renderTargetRentForm = () => {
    const { otherPlayers, targetRent } = this.props
    const { playingTargetRent } = this.state

    const cancelTargetRent = () => this.setState({ playingTargetRent: false })

    const startTargetRent = (target: Player) => {
      targetRent(target)
      cancelTargetRent()
    }

    return (
      <div>
        {playingTargetRent &&
          <PlayerSelectorForm
            label='Select a player to rent'
            players={otherPlayers}
            onSubmit={startTargetRent}
            onCancel={cancelTargetRent}
          />
        }
      </div>
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

    const {
      needsToDiscard,
      slyDealing,
      forceDealing,
      dealBreaker,
      playingTargetRent
    } = this.state

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
            {playingTargetRent &&
              this.renderTargetRentForm()
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
