/* @flow */
import React from 'react'
import GamesList from '../../components/GamesList'
import FullWidth from '../../../../components/FullWidth'
import TextFormDialog from '../../../../components/TextFormDialog'
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

type State = {
  addingGame: boolean
}

const mapStateToProps = (state) => ({
  games: state.games
})

export class GamesView extends React.Component {
  props: Props

  state: State

  state = {
    addingGame: false
  }

  componentDidMount () {
    this.props.getGames(this.props.games.page)
    this.props.subscribeSocket(global.socket)
  }

  componentWillUnmount () {
    this.props.unsubscribeSocket(global.socket)
  }

  addGame = (name: string) => {
    this.props.addGame({ name })
    this.cancelAddingGame()
  }

  addingGame = () => {
    this.setState({
      addingGame: true
    })
  }

  cancelAddingGame = () => {
    this.setState({
      addingGame: false
    })
  }

  nextPage = () => {
    this.props.getGames(this.props.games.page + 1)
  }

  previousPage = () => {
    this.props.getGames(this.props.games.page - 1)
  }

  render () {
    const { addingGame } = this.state
    const { games, count, page, limit } = this.props.games

    const totalPages = Math.ceil(count / limit)

    return (
      <FullWidth>
        <h1>Games</h1>
        <Button onClick={this.addingGame} bsStyle='primary'>
          Add new Game
        </Button>
        <GamesList
          games={games}
          page={page}
          totalPages={totalPages}
          onNextPage={this.nextPage}
          onPreviousPage={this.previousPage}
        />
        {addingGame &&
          <TextFormDialog
            allowSpaces
            cancelable
            header='Add Game'
            inputLabel="Game's name"
            submitLabel='Add'
            onSubmit={this.addGame}
            onCancel={this.cancelAddingGame}
          />
        }
      </FullWidth>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(GamesView)

