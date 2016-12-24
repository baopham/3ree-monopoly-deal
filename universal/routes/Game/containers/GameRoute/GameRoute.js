/* @flow */
import React from 'react'
import Container from '../../../../components/Container'
import Game from '../Game'
import { connect } from 'react-redux'
import { actions } from '../../modules/currentGame'
import type { CurrentGameState } from '../../modules/currentGame'

type Props = {
  currentGame: CurrentGameState,
  getGame: (id: string) => void,
  params: { id: string },
  subscribeSocket: (socket: Socket, id: string) => void,
  unsubscribeSocket: (socket: Socket) => void
}

const mapStateToProps = (state) => ({
  currentGame: state.currentGame
})

export class GameRoute extends React.Component {
  props: Props

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
