import React, { PropTypes } from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default class DiscardCardButton extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { disabled, onClick } = this.props

    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        bsStyle="primary"
        bsSize="xsmall"
        title="Discard your card"
      >
        <Glyphicon glyph="trash" />
      </Button>
    )
  }
}


