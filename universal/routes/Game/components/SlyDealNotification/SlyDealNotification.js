/* @flow */
import React from 'react'
import Card from '../Card'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Modal, Button } from 'react-bootstrap'

type Props = {
  fromUser: Username,
  toUser: Username,
  currentPlayerIsRequester: boolean,
  cardToSlyDeal: CardKey,
  acceptSlyDeal: () => void,
  sayNoButton: ?Node
}

export default class SlyDealNotification extends React.Component {
  props: Props

  render () {
    const {
      currentPlayerIsRequester,
      sayNoButton,
      cardToSlyDeal,
      fromUser,
      toUser,
      acceptSlyDeal
    } = this.props

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>Sly Deal Notification</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {currentPlayerIsRequester &&
            <div>
              Requesting to sly deal
              <Card card={cardToSlyDeal} size='xsmall' faceUp />
              from {toUser}... Please wait.
            </div>
          }

          {!currentPlayerIsRequester &&
            <div>
              {fromUser} wants to sly deal
              <Card card={cardToSlyDeal} size='xsmall' faceUp />
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
              <Button bsStyle='primary' onClick={acceptSlyDeal}>
                Accept
              </Button>
            </div>
          }
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}