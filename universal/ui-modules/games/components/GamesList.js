import React, { PropTypes } from 'react'

export default class GamesList extends React.Component {
  static propTypes = {
    games: PropTypes.array.isRequired
  }

  render() {
    const { games } = this.props

    return (
      <ol>
        {games.map((game, i) =>
          <li key={i}>{JSON.stringify(game)}</li>
        )}
      </ol>
    )
  }
}
