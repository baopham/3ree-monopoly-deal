import React, { PropTypes } from 'react'
import GamesList from '../../components/GamesList'
import FullWidth from '../../../../components/FullWidth'
import { Button } from 'react-bootstrap'
import { actions } from '../../modules/games'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  games: state.games
})

export class GamesRoute extends React.Component {
  static propTypes = {
    games: PropTypes.object.isRequired,
    addGame: PropTypes.func.isRequired,
    getGames: PropTypes.func.isRequired,
    subscribeSocket: PropTypes.func.isRequired,
    unsubscribeSocket: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.getGames(this.props.games.page)
    !!global.socket && this.props.subscribeSocket(global.socket)
  }

  componentWillUnmount () {
    !!global.socket && this.props.unsubscribeSocket(global.socket)
  }

  addGame = () => {
    this.props.addGame({
      name: `Random Game ${new Date()}`
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
