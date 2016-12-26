/* @flow */
import React from 'react'
import { Link } from 'react-router'
import { Table } from 'react-bootstrap'

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
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Winner</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, i) =>
              <tr key={i}>
                <td><Link to={`/games/${game.id}`}>{game.name}</Link></td>
                <td>{game.winner}</td>
                <td>{game.createdAt}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    )
  }
}
