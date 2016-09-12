import React, { PropTypes } from 'react'
import Board from '../components/Board'
import CardsOnHand from '../components/CardsOnHand'
import JoinForm from '../components/JoinForm'
import { connect } from 'react-redux'
import { actions } from '../../../ducks/currentGame'

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameContainer extends React.Component {
  static propTypes = {
    currentGame: PropTypes.object.isRequired,
    getGame: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired,
    currentGameId: PropTypes.string.isRequired,
    subscribeSocket: PropTypes.func.isRequired,
    unsubscribeSocket: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.getGame(this.props.currentGameId)
    !!global.socket && this.props.subscribeSocket(global.socket, this.props.currentGameId)
  }

  componentWillUnmount () {
    !!global.socket && this.props.unsubscribeSocket(global.socket)
  }

  render () {
    const { join } = this.props
    const { game, membership } = this.props.currentGame

    const currentMember = game && membership[game.id]

    return (
      <div>
        {game &&
          <div>
            <p>Game: {game.id}</p>
            <Board game={game} />
            {!currentMember &&
              <JoinForm onJoin={join} />
            }
            {currentMember &&
              <CardsOnHand member={currentMember} />
            }
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
