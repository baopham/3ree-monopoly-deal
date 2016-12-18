import React, { PropTypes } from 'react'
import { Modal, Glyphicon } from 'react-bootstrap'

export default class WinnerNotification extends React.Component {
  static propTypes = {
    winner: PropTypes.string.isRequired,
    hasWon: PropTypes.bool
  }

  render () {
    const { winner, hasWon } = this.props

    return (
      <Modal show>
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
      </Modal>
    )
  }
}
