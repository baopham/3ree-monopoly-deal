import React, { PropTypes } from 'react'
import GamesList from '../components/GamesList'
import { actions } from '../../../ducks/games'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  games: state.games
})

export class GamesContainer extends React.Component {
  static propTypes = {
    games: PropTypes.object.isRequired,
    addGame: PropTypes.func.isRequired,
    getGames: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.getGames(this.props.games.page)
  }

  addGame = () => {
    this.props.addGame({
      winner: 'noone'
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
      <div>
        <GamesList games={games} />
        <button onClick={this.addGame}>
          Add
        </button>
        {page < (totalPages - 1) &&
          <button onClick={this.nextPage}>
            Next
          </button>
        }
        {page > 0 &&
          <button onClick={this.previousPage}>
            Previous
          </button>
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(GamesContainer)
