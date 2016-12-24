/* @flow */
import React from 'react'
import PlacedCards from '../PlacedCards'

type Props = {
  player: Player,
  onWinning: (username: Username) => void
}

export default class PlayerComponent extends React.Component {
  props: Props

  onWinning = () => {
    this.props.onWinning(this.props.player.username)
  }

  render () {
    const { player } = this.props

    return (
      <div>
        <PlacedCards
          cards={player.placedCards}
          onWinning={this.onWinning}
        />
      </div>
    )
  }
}
