/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { actions } from '../../modules/cardRequest'
import { getCurrentPlayer, canSayNo } from '../../modules/gameSelectors'
import SayNoButton from '../SayNoButton'
import SlyDealAlert from '../../components/SlyDealAlert'
import sayNoCauses from '../../../../monopoly/sayNoCauses'
import type { SlyDealState } from '../../modules/cardRequest/slyDeal'

type Props = {
  slyDeal: SlyDealState,
  currentPlayer: Player,
  canSayNo: boolean,
  acceptSlyDeal: (requestId: string) => void
}

const mapStateToProps = (state) => ({
  slyDeal: state.cardRequest.slyDeal,
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

  render () {
    const { slyDeal, acceptSlyDeal, currentPlayer } = this.props

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
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...actions }
)(CardRequest)
