import React, { PropTypes } from 'react'
import DrawPile from './DrawPile'
import DiscardPile from './DiscardPile'
import PlacedCards from './PlacedCards'

export default class Board extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  }

  render () {
    const { game } = this.props

    return (
      <div>
        <DrawPile cards={game.availableCards} />
        <DiscardPile cards={game.discardedCards} />
        {game.members.map((member, i) =>
          <PlacedCards key={i} member={member} />
        )}
      </div>
    )
  }
}

