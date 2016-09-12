import React, { PropTypes } from 'react'
import { Link } from 'react-router'

export default class GamesList extends React.Component {
  static propTypes = {
    games: PropTypes.array.isRequired
  }

  render () {
    const { games } = this.props

    return (
      <div>
        <h1>Games</h1>
        <ol>
          {games.map((game, i) =>
            <li key={i}>
              <Link to={`/games/${game.id}`}>{game.id}</Link>
            </li>
          )}
        </ol>
      </div>
    )
  }
}
