/* @flow */
import React from 'react'
import { Link } from 'react-router'
import { Table, Pager } from 'react-bootstrap'

type Props = {
  games: Game[],
  page: number,
  totalPages: number,
  onNextPage: (e: Event) => void,
  onPreviousPage: (e: Event) => void
}

export default class GamesList extends React.Component {
  props: Props

  render () {
    const { games, page, totalPages, onNextPage, onPreviousPage } = this.props

    return (
      <div>
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
        <Pager>
          <Pager.Item previous onClick={onPreviousPage} disabled={page <= 0}>
            Previous
          </Pager.Item>
          <Pager.Item next onClick={onNextPage} disabled={page >= (totalPages - 1)}>
            Next
          </Pager.Item>
        </Pager>
      </div>
    )
  }
}
