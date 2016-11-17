import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Glyphicon } from 'react-bootstrap'
import { getCurrentPlayer, isPlayerTurn } from '../../modules/gameSelectors'
import { actions } from '../../modules/currentPlayerCards'

const mapStateToProps = (state) => ({
  isPlayerTurn: isPlayerTurn(state),
  currentPlayer: getCurrentPlayer(state)
})

export class DrawCardsButton extends React.Component {
  static propTypes = {
    isPlayerTurn: PropTypes.bool,
    currentPlayer: PropTypes.object,
    drawCards: PropTypes.func.isRequired
  }

  constructor (...args) {
    super(...args)

    this.state = {
      hasDrawnCards: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { isPlayerTurn } = this.props

    if (!isPlayerTurn) {
      this.setState({
        hasDrawnCards: false
      })
    }
  }

  onClick = () => {
    this.props.drawCards()

    this.setState({
      hasDrawnCards: true
    })
  }

  shouldDisable () {
    const { isPlayerTurn, currentPlayer } = this.props
    const isDisabled = !isPlayerTurn || this.state.hasDrawnCards
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
