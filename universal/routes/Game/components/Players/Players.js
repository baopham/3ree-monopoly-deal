import React, { PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import Player from '../Player'

export default class Players extends React.Component {
  static propTypes = {
    players: PropTypes.array.isRequired
  }

  render () {
    const { players } = this.props

    return (
      <div>
        {players.map(player =>
          <Panel key={player.id} header={`Player: ${player.username}`}>
            <Player player={player} />
          </Panel>
        )}
      </div>
    )
  }
}
