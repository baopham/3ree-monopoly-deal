/* @flow */
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

type Props = {
  isPlayerTurn: boolean,
  className?: string,
  onDrawCards: () => void
}

type State = {
  hasDrawnCards: boolean
}

export default class DrawCardsButton extends React.Component {
  props: Props

  state: State

  constructor (props: Props) {
    super(props)

    this.state = {
      hasDrawnCards: false
    }
  }

  componentWillReceiveProps (nextProps: Props) {
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
