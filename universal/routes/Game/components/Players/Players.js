/* @flow */
import React from 'react'
import PlayerComponent from '../Player'
import ActionCounter from '../ActionCounter'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  players: Player[],
  currentPlayer: Player,
  isPlayerTurn: boolean,
  onWinning: (username: Username) => void,
  onFlipCard: (card: CardKey, propertySetId: PropertySetId) => void,
  onMoveCard: (card: CardKey, fromSetId: PropertySetId, toSetId: PropertySetId) => void
}

export default class Players extends React.Component {
  props: Props

  renderHeader (player: Player) {
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
    const { currentPlayer, isPlayerTurn, players, onWinning, onMoveCard, onFlipCard } = this.props

    return (
      <div>
        {players.map(player =>
          <PlayerComponent
            key={player.id}
            isCurrentPlayer={currentPlayer.username === player.username}
            isPlayerTurn={isPlayerTurn}
            player={player}
            onWinning={onWinning}
            onMoveCard={onMoveCard}
            onFlipCard={onFlipCard}
          />
        )}
      </div>
    )
  }
}
