/* @flow */
import React from 'react'
import { Panel } from 'react-bootstrap'
import PlayerComponent from '../Player'
import ActionCounter from '../ActionCounter'

type Props = {
  players: Player[],
  currentPlayer: Player,
  onWinning: (username: Username) => void
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
    const { currentPlayer, players, onWinning } = this.props

    return (
      <div>
        {players.map(player =>
          <Panel
            key={player.id}
            header={this.renderHeader(player)}
            bsStyle={currentPlayer.username === player.username ? 'success' : 'default'}
          >
            <PlayerComponent
              player={player}
              onWinning={onWinning}
            />
          </Panel>
        )}
      </div>
    )
  }
}
