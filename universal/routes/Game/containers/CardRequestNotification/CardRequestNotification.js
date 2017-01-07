/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../../modules/cardRequest'
import { getCurrentPlayer } from '../../modules/gameSelectors'
import SayNoButton from '../SayNoButton'
import SlyDealNotification from '../../components/SlyDealNotification'
import sayNoCauses from '../../../../monopoly/sayNoCauses'
import type { SlyDealState } from '../../modules/cardRequest/slyDeal'

type Props = {
  slyDeal: SlyDealState,
  currentPlayer: Player,
  acceptSlyDeal: (requestId: string) => void
}

const mapStateToProps = (state) => ({
  slyDeal: state.cardRequest.slyDeal,
  currentPlayer: getCurrentPlayer(state)
})

export class CardRequest extends React.Component {
  props: Props

  renderSayNoButtonForSlyDeal = () => {
    const { slyDeal } = this.props

    return (
      <SayNoButton
        toUser={slyDeal.fromUser}
        cause={sayNoCauses.SLY_DEAL}
        clickOnceOnly
      >
        Say No?
      </SayNoButton>
    )
  }

  render () {
    const { slyDeal, acceptSlyDeal, currentPlayer } = this.props

    return (
      <div>
        {!!slyDeal.slyDealRequestId &&
          <SlyDealNotification
            fromUser={slyDeal.fromUser}
            toUser={slyDeal.toUser}
            currentPlayerIsRequester={currentPlayer.username === slyDeal.fromUser}
            cardToSlyDeal={slyDeal.card}
            sayNoButton={this.renderSayNoButtonForSlyDeal()}
            acceptSlyDeal={() => acceptSlyDeal(slyDeal.slyDealRequestId)}
          />
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...actions }
)(CardRequest)
