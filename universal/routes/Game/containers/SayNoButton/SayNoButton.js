/* @flow */
import React from 'react'
import { SAY_NO } from '../../../../monopoly/cards'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { actions as sayNoActions } from '../../modules/sayNo'
import { actions as cardsOnHandActions } from '../../modules/currentPlayerCardsOnHand'
import type { SayNoCause } from '../../../../monopoly/sayNoCauses'

type Props = {
  cause: SayNoCause,
  toUser: string,
  disabled?: boolean,
  clickOnceOnly: boolean,
  sayNo: (toUser: Username, onSuccess: Function, cause: SayNoCause) => void,
  discardCard: (card: CardKey) => void,
  children: React$Element<*>
}

type State = {
  clicked: boolean
}

const mapStateToProps = (state) => ({})

export class SayNoButton extends React.Component {
  props: Props

  state: State

  state = {
    clicked: false
  }

  sayNo = () => {
    const { sayNo, toUser, cause } = this.props
    this.setState({ clicked: true })
    sayNo(toUser, this.removeSayNoCardFromHand, cause)
  }

  removeSayNoCardFromHand = () => {
    this.props.discardCard(SAY_NO)
  }

  render () {
    const { disabled, children, clickOnceOnly } = this.props
    const { clicked } = this.state

    return (
      <Button
        bsStyle='info'
        disabled={disabled || (clickOnceOnly && clicked)}
        onClick={this.sayNo}
      >
        {children}
      </Button>
    )
  }
}

export default connect(
  mapStateToProps,
  { ...sayNoActions, ...cardsOnHandActions }
)(SayNoButton)
