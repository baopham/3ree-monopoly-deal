/* @flow */
import React from 'react'
import Card from '../Card'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Modal, Button } from 'react-bootstrap'

type Props = {
  currentPlayerIsRequester: boolean,
  fromUser: Username,
  toUser: Username,
  fromUserCard: CardKey,
  toUserCard: CardKey,
  acceptForcedDeal: () => void,
  sayNoButton: ?Node
}

export default class ForcedDealAlert extends React.Component {
  props: Props

  render () {
    const {
      fromUser,
      toUser,
      fromUserCard,
      toUserCard,
      acceptForcedDeal,
      sayNoButton,
      currentPlayerIsRequester
    } = this.props

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>Forced Deal Alert</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {currentPlayerIsRequester &&
            <div>
              Requesting to swap
              <Card card={fromUserCard} size='xsmall' faceUp />
              {' '}
              with
              {' '}
              <Card card={toUserCard} size='xsmall' faceUp />
              {' '}
              from {toUser}... Please wait
            </div>
          }

          {!currentPlayerIsRequester &&
            <div>
              {fromUser} wants to swap
              {' '}
              <Card card={fromUserCard} size='xsmall' faceUp />
              {' '}
              with
              {' '}
              <Card card={toUserCard} size='xsmall' faceUp />
              {' '}
              from you. Accept?
            </div>
          }
        </Modal.Body>

        <Modal.Footer>
          {!currentPlayerIsRequester &&
            <div>
              {!!sayNoButton &&
                <div className='pull-left'>
                  {sayNoButton}
                </div>
              }
              <Button bsStyle='primary' onClick={acceptForcedDeal}>
                Accept
              </Button>
            </div>
          }
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
