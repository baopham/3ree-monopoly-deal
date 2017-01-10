/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../../modules/cardRequest'
import { getCurrentPlayer, canSayNo } from '../../modules/gameSelectors'
import SayNoButton from '../SayNoButton'
import SlyDealAlert from '../../components/SlyDealAlert'
import ForcedDealAlert from '../../components/ForcedDealAlert'
import sayNoCauses from '../../../../monopoly/sayNoCauses'
import type { SlyDealState } from '../../modules/cardRequest/slyDeal'
import type { ForcedDealState } from '../../modules/cardRequest/forcedDeal'

type Props = {
  slyDeal: SlyDealState,
  forcedDeal: ForcedDealState,
  currentPlayer: Player,
  canSayNo: boolean,
  acceptSlyDeal: (requestId: string) => void,
  acceptForcedDeal: (requestId: string) => void
}

const mapStateToProps = (state) => ({
  slyDeal: state.cardRequest.slyDeal,
  forcedDeal: state.cardRequest.forcedDeal,
  currentPlayer: getCurrentPlayer(state),
  canSayNo: canSayNo(state)
})

export class CardRequest extends React.Component {
  props: Props

  renderSayNoButtonForSlyDeal = () => {
    const { slyDeal, canSayNo } = this.props

    if (!canSayNo) {
      return null
    }

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

  renderSayNoButtonForForcedDeal = () => {
    const { forcedDeal, canSayNo } = this.props

    if (!canSayNo) {
      return null
    }

    return (
      <SayNoButton
        toUser={forcedDeal.fromUser}
        cause={sayNoCauses.FORCED_DEAL}
        clickOnceOnly
      >
        Say No?
      </SayNoButton>
    )
  }

  render () {
    const {
      slyDeal,
      forcedDeal,
      acceptSlyDeal,
      acceptForcedDeal,
      currentPlayer
    } = this.props

    return (
      <div>
        {!!slyDeal.slyDealRequestId &&
          <SlyDealAlert
            fromUser={slyDeal.fromUser}
            toUser={slyDeal.toUser}
            currentPlayerIsRequester={currentPlayer.username === slyDeal.fromUser}
            cardToSlyDeal={slyDeal.card}
            sayNoButton={this.renderSayNoButtonForSlyDeal()}
            acceptSlyDeal={() => acceptSlyDeal(slyDeal.slyDealRequestId)}
          />
        }

        {!!forcedDeal.forcedDealRequestId &&
          <ForcedDealAlert
            fromUser={forcedDeal.fromUser}
            toUser={forcedDeal.toUser}
            fromUserCard={forcedDeal.fromUserCard}
            toUserCard={forcedDeal.toUserCard}
            currentPlayerIsRequester={currentPlayer.username === forcedDeal.fromUser}
            sayNoButton={this.renderSayNoButtonForForcedDeal()}
            acceptForcedDeal={() => acceptForcedDeal(forcedDeal.forcedDealRequestId)}
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
