import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FullWidth from '../../../../components/FullWidth'
import JoinForm from '../../components/JoinForm'
import CardsOnHand from '../../components/CardsOnHand'
import Board from '../Board'
import { getCurrentPlayer } from '../../modules/gameSelector'
import { actions } from '../../modules/currentGame'

const mapStateToProps = (state) => {
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  currentPlayerCards: state.currentPlayerCards
}

export default class Game extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    currentPlayer: PropTypes.object,
    currentPlayerCards: PropTypes.object,
    join: PropTypes.func.isRequired
  }

  render () {
    const { game, currentPlayer, join, currentPlayerCards } = this.props

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>
        <Board />

        {!currentPlayer &&
          <JoinForm onJoin={join} />
        }
        {currentPlayer &&
          <CardsOnHand cards={currentPlayerCards.cardsOnHand} />
        }
      </FullWidth>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(Game)
