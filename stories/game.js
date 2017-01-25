/* @flow */
import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import { playableForcedDealState, playableSlyDealState, playersHaveFullSetsState } from './game.state'
import { getCurrentPlayer, getOtherPlayers, isPlayerTurn } from '../universal/routes/Game/modules/gameSelectors'
import { CardsOnHand } from '../universal/routes/Game/containers/CardsOnHand/CardsOnHand'
import DealBreakerForm from '../universal/routes/Game/components/DealBreakerForm'

storiesOf('game.CardsOnHand', module)
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

storiesOf('game.DealBreakerForm', module)
  .add('other players have full sets', () => (
    <DealBreakerForm
      otherPlayers={getOtherPlayers(playersHaveFullSetsState)}
      onSelect={action('select set')}
      onCancel={action('cancel deal break')}
    />
  ))
