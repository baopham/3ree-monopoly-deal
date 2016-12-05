import React, { PropTypes } from 'react'
import Container from '../../../../components/Container'
import Game from '../Game'
import { connect } from 'react-redux'
import { actions } from '../../modules/currentGame'

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameRoute extends React.Component {
  static propTypes = {
    currentGame: PropTypes.object.isRequired,
    getGame: PropTypes.func.isRequired,
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
    const { game } = this.props.currentGame

    return (
      <Container fluid>
        {game &&
          <Game />
        }
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(GameRoute)


