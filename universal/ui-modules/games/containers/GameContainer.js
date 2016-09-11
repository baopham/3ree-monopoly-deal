import React, { PropTypes } from 'react'
import Board from '../components/Board'
import { connect } from 'react-redux'
import { actions } from '../../../ducks/currentGame'

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameContainer extends React.Component {
  static propTypes = {
    currentGame: PropTypes.object.isRequired,
    getGame: PropTypes.func.isRequired,
    currentGameId: PropTypes.string.isRequired
  }

  componentDidMount () {
    this.props.getGame(this.props.currentGameId)
  }

  render () {
    const { game } = this.props.currentGame

    return (
      <div>
        {game.id &&
          <div>
            <p>Game: {game.id}</p>
            <Board game={game} />
          </div>
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(GameContainer)
