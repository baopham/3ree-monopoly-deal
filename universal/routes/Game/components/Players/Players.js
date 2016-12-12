import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import Player from '../Player'
import ActionCounter from '../ActionCounter'

export default class Players extends React.Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    currentPlayer: PropTypes.object.isRequired
  }

  renderHeader (player) {
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
    const { currentPlayer, players } = this.props

    return (
      <div>
        {players.map(player =>
          <Panel
            key={player.id}
            header={this.renderHeader(player)}
            bsStyle={currentPlayer.username === player.username ? 'success' : 'default'}
          >
            <Player player={player} />
          </Panel>
        )}
      </div>
    )
  }
}
