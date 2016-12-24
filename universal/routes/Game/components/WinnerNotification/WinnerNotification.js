/* @flow */
import React from 'react'
import { Modal, Glyphicon } from 'react-bootstrap'
import ScrollableBackgroundModal from '../../../../components/ScrollableBackgroundModal'

type Props = {
  winner: Username,
  hasWon: boolean
}

export default class WinnerNotification extends React.Component {
  props: Props

  render () {
    const { winner, hasWon } = this.props

    return (
      <ScrollableBackgroundModal show>
        <Modal.Header>
          {hasWon &&
            <Modal.Title>
              You have won!!!!
            </Modal.Title>
          }
          {!hasWon &&
            <Modal.Title>
              Sorry, <strong>{winner}</strong> has won :(
            </Modal.Title>
          }
        </Modal.Header>

        <Modal.Body>
          <h1 className='text-center'>
            {hasWon &&
              <Glyphicon className='text-success' glyph='thumbs-up' />
            }
            {!hasWon &&
              <Glyphicon className='text-info' glyph='thumbs-down' />
            }
          </h1>
        </Modal.Body>
      </ScrollableBackgroundModal>
    )
  }
}
