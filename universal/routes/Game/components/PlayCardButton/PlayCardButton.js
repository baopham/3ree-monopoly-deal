/* @flow */
import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

type Props = {
  disabled?: boolean,
  onClick: (e: Event) => void
}

export default class PlayCardButton extends React.Component {
  props: Props

  render () {
    const { disabled, onClick } = this.props

    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        bsStyle='primary'
        bsSize='xsmall'
        title='Place card in the center'
      >
        <Glyphicon glyph='play' />
      </Button>
    )
  }
}
