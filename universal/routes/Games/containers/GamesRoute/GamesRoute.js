/* @flow */
import React from 'react'
import GamesList from '../../components/GamesList'
import FullWidth from '../../../../components/FullWidth'
import { Button } from 'react-bootstrap'
import { actions } from '../../modules/games'
import { connect } from 'react-redux'
import type { GamesState } from '../../modules/games'

type Props = {
  games: GamesState,
  addGame: (game: Object) => void,
  getGames: () => void,
  subscribeSocket: (socket: Socket) => void,
  unsubscribeSocket: (socket: Socket) => void
}

const mapStateToProps = (state) => ({
  games: state.games
})

export class GamesRoute extends React.Component {
  props: Props

  componentDidMount () {
    this.props.getGames(this.props.games.page)
    !!global.socket && this.props.subscribeSocket(global.socket)
  }

  componentWillUnmount () {
    !!global.socket && this.props.unsubscribeSocket(global.socket)
  }

  addGame = () => {
    this.props.addGame({
      name: `Random Game ${new Date().toString()}`
    })
  }

  nextPage = () => {
    this.props.getGames(this.props.games.page + 1)
  }

  previousPage = () => {
    this.props.getGames(this.props.games.page - 1)
  }

  render () {
    const { games, count, page, limit } = this.props.games

    const totalPages = Math.ceil(count / limit)

    return (
      <FullWidth>
        <GamesList games={games} />
        <Button onClick={this.addGame}>
          Add
        </Button>
        {page < (totalPages - 1) &&
          <Button onClick={this.nextPage}>
            Next
          </Button>
        }
        {page > 0 &&
          <Button onClick={this.previousPage}>
            Previous
          </Button>
        }
      </FullWidth>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(GamesRoute)
