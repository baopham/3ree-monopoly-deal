import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Glyphicon } from 'react-bootstrap'
import { getCurrentPlayer } from '../../modules/gameSelectors'
import { actions } from '../../modules/currentPlayerCards'

const mapStateToProps = (state) => ({
  currentTurn: state.currentGame.currentTurn,
  currentPlayer: getCurrentPlayer(state)
})

export class DrawCardsButton extends React.Component {
  static propTypes = {
    currentTurn: PropTypes.string,
    currentPlayer: PropTypes.object,
    drawCards: PropTypes.func.isRequired
  }

  constructor (...args) {
    super(...args)

    this.state = {
      hasDrawnCards: false,
      currentTurn: null
    }
  }

  componentWillReceiveProps (nextProps) {
    const { currentTurn } = this.props

    if (currentTurn !== this.state.currentTurn) {
      this.setState({
        hasDrawnCards: false,
        currentTurn: currentTurn
      })
    }
  }

  onClick = () => {
    this.props.drawCards()

    this.setState({
      hasDrawnCards: true,
      currentTurn: this.state.currentTurn
    })
  }

  shouldDisable () {
    const { currentTurn, currentPlayer } = this.props
    const isDisabled = currentPlayer && !this.state.hasDrawnCards && currentTurn !== currentPlayer.username
    return isDisabled
  }

  render () {
    const isDisabled = this.shouldDisable()
    const { className } = this.props

    return (
      <Button
        disabled={isDisabled}
        onClick={this.onClick}
        bsStyle="primary"
        bsSize="xsmall"
        className={className}
      >
        <Glyphicon glyph="play-circle" />
      </Button>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(DrawCardsButton)
