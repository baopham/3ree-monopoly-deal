import React, { PropTypes } from 'react'
import Modal from 'react-modal'

export default class ScrollableBackgroundModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.element)
  }

  render () {
    const { show, children } = this.props

    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={show}
        className='modal-dialog scrollable-background-modal'
        contentLabel='Modal'
      >
        <div className='modal-content'>
          {children}
        </div>
      </Modal>
    )
  }
}
