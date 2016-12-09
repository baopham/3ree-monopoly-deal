import React, { PropTypes } from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default class DrawCardsButton extends React.Component {
  static propTypes = {
    isPlayerTurn: PropTypes.bool,
    onDrawCards: PropTypes.func.isRequired
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
    this.props.onDrawCards()

    this.setState({
      hasDrawnCards: true
    })
  }

  shouldDisable () {
    const { isPlayerTurn } = this.props
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
        bsStyle='primary'
        bsSize='xsmall'
        className={className}
      >
        <Glyphicon glyph='new-window' />
      </Button>
    )
  }
}
