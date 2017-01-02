/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap'
import FullWidth from '../../../../components/FullWidth'
import TextFormDialog from '../../../../components/TextFormDialog'
import Container from '../../../../components/Container'
import GameHistoryLog from '../GameHistoryLog'
import GamePayment from '../GamePayment'
import CardsOnHand from '../CardsOnHand'
import Board from '../Board'
import WinnerNotification from '../../components/WinnerNotification'
import SayNoAlert from '../SayNoAlert'
import { getCurrentPlayer } from '../../modules/gameSelectors'
import { actions as gameActions } from '../../modules/currentGame'
import { MAX_NUMBER_OF_ACTIONS } from '../../../../monopoly/monopoly'

type Props = {
  game: Game,
  currentPlayer: Player,
  join: (username: Username) => void,
  endTurn: () => void
}

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state)
})

export class GameComponent extends React.Component {
  props: Props

  shouldComponentUpdate () {
    return !this.gameHasAWinner()
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!this.props.currentPlayer || !nextProps.currentPlayer) {
      return
    }

    if (this.props.currentPlayer.actionCounter === nextProps.currentPlayer.actionCounter) {
      return
    }

    if (nextProps.currentPlayer.actionCounter === MAX_NUMBER_OF_ACTIONS) {
      this.props.endTurn()
    }
  }

  gameHasAWinner () {
    const { game, currentPlayer } = this.props

    return currentPlayer && !!game.winner
  }

  render () {
    const {
      game,
      currentPlayer,
      join
    } = this.props

    const gameHasAWinner = this.gameHasAWinner()

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>

        {currentPlayer &&
          <div>
            <Container fluid>
              <Col md={3}>
                <GameHistoryLog />
              </Col>
              <Col md={9}>
                <CardsOnHand />
              </Col>
            </Container>

            <Board />

            <GamePayment />

            <SayNoAlert />
          </div>
        }

        {!currentPlayer &&
          <TextFormDialog
            header='Join Game'
            inputLabel='Username'
            submitLabel='Join'
            onSubmit={join}
          />
        }

        {gameHasAWinner &&
          <WinnerNotification
            winner={game.winner}
            hasWon={currentPlayer.username === game.winner}
          />
        }
      </FullWidth>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...gameActions }
)(GameComponent)
