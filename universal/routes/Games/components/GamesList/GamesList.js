/* @flow */
import React from 'react'
import { Link } from 'react-router'

type Props = {
  games: Game[]
}

export default class GamesList extends React.Component {
  props: Props

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
