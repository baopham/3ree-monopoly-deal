import React, { PropTypes } from 'react'
import Modal from 'react-modal'

export default class ScrollableBackgroundModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    customStyle: PropTypes.object,
    children: PropTypes.arrayOf(PropTypes.element)
  }

  render () {
    const { show, customStyle, children } = this.props

    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={show}
        className='modal-dialog'
      >
        <div className='modal-content'>
          {children}
        </div>
      </Modal>
    )
  }
}
