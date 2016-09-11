import React from 'react'
import GameContainer from '../../ui-modules/games/containers/GameContainer'

export class GameView extends React.Component {
  render () {
    return (
      <div>
        <GameContainer currentGameId={this.props.params.id} />
      </div>
    )
  }
}

export default GameView
