/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../../modules/cardRequest'
import { getCurrentPlayer, canSayNo } from '../../modules/gameSelectors'
import SayNoButton from '../SayNoButton'
import SlyDealAlert from '../../components/SlyDealAlert'
import ForcedDealAlert from '../../components/ForcedDealAlert'
import DealBreakerAlert from '../../components/DealBreakerAlert'
import sayNoCauses from '../../../../monopoly/sayNoCauses'
import PropertySetClass from '../../../../monopoly/PropertySet'
import type { SlyDealState } from '../../modules/cardRequest/slyDeal'
import type { ForcedDealState } from '../../modules/cardRequest/forcedDeal'
import type { DealBreakerState } from '../../modules/cardRequest/dealBreaker'

type Props = {
  slyDeal: SlyDealState,
  forcedDeal: ForcedDealState,
  dealBreaker: DealBreakerState,
  currentPlayer: Player,
  canSayNo: boolean,
  acceptSlyDeal: (requestId: string) => void,
  acceptForcedDeal: (requestId: string) => void,
  acceptDealBreaker: (requestId: string) => void
}

const mapStateToProps = (state) => ({
  slyDeal: state.cardRequest.slyDeal,
  forcedDeal: state.cardRequest.forcedDeal,
  dealBreaker: state.cardRequest.dealBreaker,
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

  renderSayNoButtonForDealBreaker = () => {
    const { dealBreaker, canSayNo } = this.props

    if (!canSayNo) {
      return null
    }

    return (
      <SayNoButton
        toUser={dealBreaker.fromUser}
        cause={sayNoCauses.DEAL_BREAKER}
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
      dealBreaker,
      acceptSlyDeal,
      acceptForcedDeal,
      acceptDealBreaker,
      currentPlayer
    } = this.props

    return (
      <div>
        {!!slyDeal.slyDealRequestId && slyDeal.fromUser && slyDeal.toUser &&
          <SlyDealAlert
            currentPlayerIsRequester={currentPlayer.username === slyDeal.fromUser}
            fromUser={slyDeal.fromUser}
            toUser={slyDeal.toUser}
            cardToSlyDeal={slyDeal.card}
            sayNoButton={this.renderSayNoButtonForSlyDeal()}
            acceptSlyDeal={() => acceptSlyDeal(slyDeal.slyDealRequestId)}
          />
        }

        {!!forcedDeal.forcedDealRequestId && forcedDeal.fromUser && forcedDeal.toUser &&
          <ForcedDealAlert
            currentPlayerIsRequester={currentPlayer.username === forcedDeal.fromUser}
            fromUser={forcedDeal.fromUser}
            toUser={forcedDeal.toUser}
            fromUserCard={forcedDeal.fromUserCard}
            toUserCard={forcedDeal.toUserCard}
            sayNoButton={this.renderSayNoButtonForForcedDeal()}
            acceptForcedDeal={() => acceptForcedDeal(forcedDeal.forcedDealRequestId)}
          />
        }

        {!!dealBreaker.dealBreakerRequestId && dealBreaker.setId && dealBreaker.fromUser && dealBreaker.toUser &&
          <DealBreakerAlert
            currentPlayerIsRequester={currentPlayer.username === dealBreaker.fromUser}
            fromUser={dealBreaker.fromUser}
            toUser={dealBreaker.toUser}
            setToDealBreak={PropertySetClass.convertIdToPropertySet(dealBreaker.setId)}
            sayNoButton={this.renderSayNoButtonForDealBreaker()}
            acceptDealBreaker={() => acceptDealBreaker(dealBreaker.dealBreakerRequestId)}
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
