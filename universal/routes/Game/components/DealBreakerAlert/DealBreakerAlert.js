/* @flow */
import React from 'react'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'
import { Modal, Button } from 'react-bootstrap'
import PropertySet from '../PropertySet'
import PropertySetClass from '../../../../monopoly/PropertySet'
import type { PropertySetId } from '../../../../monopoly/PropertySet'

type Props = {
  currentPlayerIsRequester: boolean,
  fromUser: Username,
  toUser: Username,
  setToDealBreak: PropertySetClass,
  acceptDealBreaker: () => void,
  sayNoButton?: React$Element<*>
}

export default class DealBreakerAlert extends React.Component {
  props: Props

  static defaultProps = {
    acceptDealBreaker: () => {}
  }

  render () {
    const {
      currentPlayerIsRequester,
      fromUser,
      toUser,
      setToDealBreak,
      acceptDealBreaker,
      sayNoButton
    } = this.props

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          <Modal.Title>Deal Breaker Alert</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {currentPlayerIsRequester &&
            <div>
              Requesting to deal break {toUser}
              <PropertySet propertySet={setToDealBreak} />
              Please wait...
            </div>
          }

          {!currentPlayerIsRequester &&
            <div>
              {fromUser} wants to deal break
              <PropertySet propertySet={setToDealBreak} />
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
              <Button bsStyle='primary' onClick={acceptDealBreaker}>
                Accept
              </Button>
            </div>
          }
        </Modal.Footer>
      </ScrollableBackgroundModal>
    )
  }
}
