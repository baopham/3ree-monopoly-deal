/* @flow */
import React from 'react'
import Container from '../../../../components/Container'
import Game from '../Game'
import { connect } from 'react-redux'
import { actions as gameActions } from '../../modules/currentGame'
import type { CurrentGameState } from '../../modules/currentGame'

type Props = {
  currentGame: CurrentGameState,
  getGame: (id: string) => void,
  params: { id: string },
  subscribeGameEvents: (socket: Socket, id: string) => void,
  resetCurrentGame: (socket: Socket) => void
}

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameRoute extends React.Component {
  props: Props

  componentDidMount () {
    this.props.getGame(this.props.params.id)
    this.props.subscribeGameEvents(global.socket, this.props.params.id)
  }

  componentWillUnmount () {
    this.props.resetCurrentGame(global.socket)
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
  gameActions,
)(GameRoute)
