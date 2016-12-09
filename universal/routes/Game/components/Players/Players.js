import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import Player from '../Player'
import ActionCounter from '../ActionCounter'

export default class Players extends React.Component {
  static propTypes = {
    players: PropTypes.array.isRequired
  }

  renderHeader (player) {
    return (
      <div>
        Player: {player.username}
        <ActionCounter
          className="pull-right"
          count={player.actionCounter}
        />
      </div>
    )
  }

  render () {
    const { players } = this.props

    return (
      <div>
        {players.map(player =>
          <Panel key={player.id} header={this.renderHeader(player)}>
            <Player player={player} />
          </Panel>
        )}
      </div>
    )
  }
}
