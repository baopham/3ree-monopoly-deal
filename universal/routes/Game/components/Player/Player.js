import React, { PropTypes } from 'react'
import PlacedCards from '../PlacedCards'

export default class Player extends React.Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    onWinning: PropTypes.func.isRequired
  }

  render () {
    const { player, onWinning } = this.props

    return (
      <div>
        <PlacedCards
          cards={player.placedCards}
          onWinning={onWinning}
        />
      </div>
    )
  }
}
