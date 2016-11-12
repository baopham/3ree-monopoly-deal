import React, { PropTypes } from 'react'
import Container from '../../../../components/Container'
import Game from '../../components/Game'
import { connect } from 'react-redux'
import { actions } from '../../modules/currentGame'

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameContainer extends React.Component {
  static propTypes = {
    currentGame: PropTypes.object.isRequired,
    getGame: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    subscribeSocket: PropTypes.func.isRequired,
    unsubscribeSocket: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.getGame(this.props.params.id)
    !!global.socket && this.props.subscribeSocket(global.socket, this.props.params.id)
  }

  componentWillUnmount () {
    !!global.socket && this.props.unsubscribeSocket(global.socket)
  }

  render () {
    const { join } = this.props
    const { game, membership } = this.props.currentGame
    const currentMember = game && membership[game.id]

    return (
      <Container fluid>
        {game &&
          <Game
            game={game}
            currentMember={currentMember}
            onJoin={join}
          />
        }
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(GameContainer)

