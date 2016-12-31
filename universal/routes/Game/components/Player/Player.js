/* @flow */
import React from 'react'
import PlacedCards from '../PlacedCards'
import ActionCounter from '../ActionCounter'
import { Panel } from 'react-bootstrap'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  player: Player,
  isPlayerTurn: boolean,
  isCurrentPlayer: boolean,
  onWinning: (username: Username) => void,
  onFlipCard: (card: CardKey, propertySetId: PropertySetId) => void,
  onMoveCard: (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) => void,
  onFlipLeftOverCard: (card: CardKey) => void,
  onMoveLeftOverCard: (card: CardKey, toSetId: PropertySetId) => void
}

export default class PlayerComponent extends React.Component {
  props: Props

  onWinning = () => {
    this.props.onWinning(this.props.player.username)
  }

  renderHeader () {
    const { player } = this.props

    return (
      <div>
        Player: {player.username}
        <ActionCounter
          className='pull-right'
          count={player.actionCounter}
        />
      </div>
    )
  }

  render () {
    const {
      player,
      isCurrentPlayer,
      isPlayerTurn,
      onFlipCard,
      onMoveCard,
      onFlipLeftOverCard,
      onMoveLeftOverCard
    } = this.props

    return (
      <Panel
        header={this.renderHeader()}
        bsStyle={isCurrentPlayer ? 'success' : 'default'}
      >
        <PlacedCards
          immutable={!isCurrentPlayer || !isPlayerTurn}
          cards={player.placedCards}
          onWinning={this.onWinning}
          onFlipCard={onFlipCard}
          onMoveCard={onMoveCard}
          onFlipLeftOverCard={onFlipLeftOverCard}
          onMoveLeftOverCard={onMoveLeftOverCard}
        />
      </Panel>
    )
  }
}
