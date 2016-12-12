import React, { PropTypes } from 'react'
import { Button, Glyphicon } from 'react-bootstrap'

export default class FlipCardButton extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  }

  render () {
    const { disabled, onClick, className } = this.props

    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        bsStyle='primary'
        bsSize='xsmall'
        title='Flip Card'
        className={className}
      >
        <Glyphicon glyph='sort' />
      </Button>
    )
  }
}

