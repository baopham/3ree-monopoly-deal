/* @flow */
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

type Props = {
  disabled?: boolean,
  className?: string,
  onClick: (e: Event) => void
}

export default class FlipCardButton extends React.Component {
  props: Props

  render () {
    const { disabled, onClick, className } = this.props

    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        bsStyle='primary'
        bsSize='xsmall'
        title='Move Card'
        className={className}
      >
        <Glyphicon glyph='move' />
      </Button>
    )
  }
}
