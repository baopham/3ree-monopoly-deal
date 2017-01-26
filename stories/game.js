/* @flow */
import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import { playableForcedDealState, playableSlyDealState, playersHaveFullSetsState } from './game.state'
import { getCurrentPlayer, getOtherPlayers, isPlayerTurn } from '../universal/routes/Game/modules/gameSelectors'
import { CardsOnHand } from '../universal/routes/Game/containers/CardsOnHand/CardsOnHand'
import { SayNoButton } from '../universal/routes/Game/containers/SayNoButton/SayNoButton'
import DealBreakerForm from '../universal/routes/Game/components/DealBreakerForm'
import DealBreakerAlert from '../universal/routes/Game/components/DealBreakerAlert'
import PropertySet from '../universal/monopoly/PropertySet'
import { PROPERTY_BLUE, getCardObject } from '../universal/monopoly/cards'
import sayNoCauses from '../universal/monopoly/sayNoCauses'

storiesOf('CardsOnHand', module)
  .add('with a playable forced deal', () => (
    <CardsOnHand
      currentPlayer={getCurrentPlayer(playableForcedDealState)}
      otherPlayers={getOtherPlayers(playableForcedDealState)}
      cardsOnHand={playableForcedDealState.currentPlayerCardsOnHand.cardsOnHand}
      isPlayerTurn={isPlayerTurn(playableForcedDealState)}
      placeCard={action('placing card')}
      playCard={action('playing card')}
      askToSlyDealSetCard={action('asking to sly deal a set card')}
      askToSlyDealLeftOverCard={action('asking to sly deal a left over card')}
      askToForceDealSetCard={action('asking to force deal a set card')}
      askToForceDealLeftOverCard={action('asking to force deal a left over card')}
      discardCard={action('discarding card')}
      flipCardOnHand={action('flipping card')}
    />
  ))
  .add('with a playable sly deal', () => (
    <CardsOnHand
      currentPlayer={getCurrentPlayer(playableSlyDealState)}
      otherPlayers={getOtherPlayers(playableSlyDealState)}
      cardsOnHand={playableSlyDealState.currentPlayerCardsOnHand.cardsOnHand}
      isPlayerTurn={isPlayerTurn(playableSlyDealState)}
      placeCard={action('placing card')}
      playCard={action('playing card')}
      askToSlyDealSetCard={action('asking to sly deal a set card')}
      askToSlyDealLeftOverCard={action('asking to sly deal a left over card')}
      askToForceDealSetCard={action('asking to force deal a set card')}
      askToForceDealLeftOverCard={action('asking to force deal a left over card')}
      discardCard={action('discarding card')}
      flipCardOnHand={action('flipping card')}
    />
  ))

storiesOf('DealBreakerForm', module)
  .add('other players have full sets', () => (
    <DealBreakerForm
      otherPlayers={getOtherPlayers(playersHaveFullSetsState)}
      onSelect={action('select set')}
      onCancel={action('cancel deal break')}
    />
  ))

storiesOf('DealBreakerAlert', module)
  .add('asking to deal break', () => {
    const setToDealBreak = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE])

    return (
      <DealBreakerAlert
        currentPlayerIsRequester
        fromUser='bao'
        toUser='bao2'
        setToDealBreak={setToDealBreak}
      />
    )
  })
  .add('getting a deal break and cannot say no', () => {
    const setToDealBreak = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE])

    return (
      <DealBreakerAlert
        currentPlayerIsRequester={false}
        fromUser='bao'
        toUser='bao2'
        setToDealBreak={setToDealBreak}
        acceptDealBreaker={action('accept deal break')}
      />
    )
  })
  .add('getting a deal break and can say no', () => {
    const fromUser = 'bao'
    const toUser = 'bao2'

    const setToDealBreak = new PropertySet(getCardObject(PROPERTY_BLUE), [PROPERTY_BLUE, PROPERTY_BLUE])

    const sayNoButton = (
      <SayNoButton
        clickOnceOnly
        cause={sayNoCauses.DEAL_BREAKER}
        toUser={toUser}
        sayNo={action('saying NO')}
        discardCard={action('discard SAY NO card')}
      >
        Say No?
      </SayNoButton>
    )

    return (
      <DealBreakerAlert
        currentPlayerIsRequester={false}
        fromUser={fromUser}
        toUser={toUser}
        setToDealBreak={setToDealBreak}
        sayNoButton={sayNoButton}
        acceptDealBreaker={action('accept deal break')}
      />
    )
  })
