/* @flow */
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

type Props = {
  isPlayerTurn: boolean,
  className?: string,
  onEndTurn: () => void
}

export default class EndTurnButton extends React.Component {
  props: Props

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
