import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FullWidth from '../../../../components/FullWidth'
import JoinForm from '../../components/JoinForm'
import CardsOnHand from '../../components/CardsOnHand'
import Board from '../Board'
import { getCurrentPlayer } from '../../modules/gameSelectors'
import { actions as gameActions } from '../../modules/currentGame'
import { actions as playerCardsActions } from '../../modules/currentPlayerCards'

const mapStateToProps = (state) => ({
  game: state.currentGame.game,
  currentPlayer: getCurrentPlayer(state),
  currentPlayerCards: state.currentPlayerCards
})

export class Game extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    currentPlayer: PropTypes.object,
    currentPlayerCards: PropTypes.object,
    placeCard: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired
  }

  render () {
    const {
      game,
      currentPlayer,
      join,
      currentPlayerCards,
      placeCard
    } = this.props

    return (
      <FullWidth fluid>
        <h2>Game: {game.name}</h2>

        {currentPlayer &&
          <CardsOnHand
            cards={currentPlayerCards.cardsOnHand}
            onPlaceCard={placeCard}
          />
        }

        <Board />

        {!currentPlayer &&
          <JoinForm onJoin={join} />
        }
      </FullWidth>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...gameActions, ...playerCardsActions }
)(Game)
