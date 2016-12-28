/* @flow */
import React from 'react'
import Container from '../../../../components/Container'
import Game from '../Game'
import { connect } from 'react-redux'
import { actions as gameActions } from '../../modules/currentGame'
import { actions as gameHistoryActions } from '../../modules/gameHistory'
import type { CurrentGameState } from '../../modules/currentGame'

type Props = {
  currentGame: CurrentGameState,
  getGame: (id: string) => void,
  params: { id: string },
  subscribeGameEvent: (socket: Socket, id: string) => void,
  unsubscribeGameEvent: (socket: Socket) => void,
  subscribeGameHistoryEvent: (socket: Socket, id: string) => void,
  unsubscribeGameHistoryEvent: (socket: Socket) => void,
  resetCurrentGame: () => void
}

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameRoute extends React.Component {
  props: Props

  componentDidMount () {
    this.props.getGame(this.props.params.id)
    this.props.subscribeGameEvent(global.socket, this.props.params.id)
    this.props.subscribeGameHistoryEvent(global.socket, this.props.params.id)
  }

  componentWillUnmount () {
    this.props.unsubscribeGameEvent(global.socket)
    this.props.unsubscribeGameHistoryEvent(global.socket)
    this.props.resetCurrentGame()
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
  { ...gameActions, ...gameHistoryActions }
)(GameRoute)
