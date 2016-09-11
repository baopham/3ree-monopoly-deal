import React from 'react'
import GameContainer from '../../ui-modules/games/containers/GameContainer'

export class GameView extends React.Component {
  render () {
    return (
      <GameContainer currentGameId={this.props.params.id} />
    )
  }
}

export default GameView
