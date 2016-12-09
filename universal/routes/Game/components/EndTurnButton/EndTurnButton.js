import React, { PropTypes } from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default class EndTurnButton extends React.Component {
  static propTypes = {
    isPlayerTurn: PropTypes.bool,
    onEndTurn: PropTypes.func.isRequired
  }

  render () {
    const {
      isPlayerTurn,
      onEndTurn,
      className
    } = this.props

    return (
      <Button
        disabled={!isPlayerTurn}
        bsStyle='danger'
        bsSize='xsmall'
        title='End Turn'
        onClick={onEndTurn}
        className={className}
      >
        <Glyphicon glyph='stop' />
      </Button>
    )
  }
}

