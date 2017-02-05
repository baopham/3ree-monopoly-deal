/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import AlertBar from '../../../../components/AlertBar'
import SayNoButton from '../SayNoButton'
import { actions } from '../../modules/sayNo'
import { canRespondToASayNo, getCurrentPlayer } from '../../modules/gameSelectors'
import type { SayNoCause } from '../../../../monopoly/sayNoCauses'

type Props = {
  fromUser: Username,
  toUser: Username,
  cause: SayNoCause,
  currentPlayer: Player,
  canRespondToASayNo: boolean,
  acceptSayNo: () => void,
  getCurrentSayNoStatus: () => void
}

const mapStateToProps = (state) => ({
  fromUser: state.sayNo.fromUser,
  toUser: state.sayNo.toUser,
  cause: state.sayNo.cause,
  currentPlayer: getCurrentPlayer(state),
  canRespondToASayNo: canRespondToASayNo(state)
})

export class SayNoAlert extends React.Component {
  props: Props

  componentDidMount () {
    this.props.getCurrentSayNoStatus()
  }

  render () {
    const {
      fromUser,
      toUser,
      cause,
      currentPlayer,
      canRespondToASayNo,
      acceptSayNo
    } = this.props

    const waitingForResponse = currentPlayer.username === fromUser

    return (
      <AlertBar show={toUser === currentPlayer.username || waitingForResponse}>
        {!waitingForResponse &&
          <div>
            {fromUser} said NO to you.
            &nbsp;
            <SayNoButton toUser={fromUser} cause={cause} disabled={!canRespondToASayNo}>
              Say No back?
            </SayNoButton>
            &nbsp;
            <Button
              bsStyle='default'
              onClick={acceptSayNo}
            >
              Oh well...
            </Button>
          </div>
        }
        {waitingForResponse &&
          <div>
            {`You said NO to ${toUser}. Waiting for their response`}
          </div>
        }
      </AlertBar>
    )
  }
}

export default connect(
  mapStateToProps,
  actions
)(SayNoAlert)
