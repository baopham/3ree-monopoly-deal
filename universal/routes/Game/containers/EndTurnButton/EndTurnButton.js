import React, { PropTypes } from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import { isPlayerTurn } from '../../modules/gameSelectors'
import { connect } from 'react-redux'
import { actions } from '../../modules/currentGame'

const mapStateToProps = (state) => ({
  isPlayerTurn: isPlayerTurn(state)
})

export class EndTurnButton extends React.Component {
  static propTypes = {
    isPlayerTurn: PropTypes.bool,
    endTurn: PropTypes.func.isRequired
  }

  render () {
    const { isPlayerTurn, endTurn, className } = this.props

    return (
      <Button
        disabled={!isPlayerTurn}
        bsStyle="danger"
        bsSize="xsmall"
        title="End Turn"
        onClick={endTurn}
        className={className}
      >
        <Glyphicon glyph="stop" />
      </Button>
    )
  }
}

export default connect(
  mapStateToProps,
  { endTurn: actions.endTurn }
)(EndTurnButton)
