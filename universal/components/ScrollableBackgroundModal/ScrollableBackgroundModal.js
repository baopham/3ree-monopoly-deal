/* @flow */
import React from 'react'
import Modal from 'react-modal'
import { Glyphicon } from 'react-bootstrap'

const styles = {
  sizeControllers: {
    position: 'absolute',
    left: '94%',
    zIndex: 1000,
    opacity: 0.8,
    paddingTop: 5,
    fontSize: 12
  },
  clickable: {
    cursor: 'pointer'
  },
  minimized: {
    position: 'fixed',
    top: '93%',
    left: 0,
    height: 50,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: 400
  },
  maximized: {

  }
}

type Props = {
  show: boolean,
  children: ?React$Element<*>[]
}

type State = {
  minimized: boolean
}

export default class ScrollableBackgroundModal extends React.Component {
  props: Props

  state: State = {
    minimized: false
  }

  static defaultProps = {
    show: false,
    children: null
  }

  sizeToggle = () => {
    this.setState({ minimized: !this.state.minimized })
  }

  render () {
    const { show, children } = this.props
    const { minimized } = this.state

    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={show}
        className='modal-dialog scrollable-background-modal'
        contentLabel='Modal'
      >
        <div className='modal-content' style={styles[minimized ? 'minimized' : 'maximized']}>
          <div style={styles.sizeControllers}>
            <Glyphicon
              style={styles.clickable}
              glyph={minimized ? 'resize-full' : 'minus'}
              onClick={this.sizeToggle}
            />
          </div>
          {children}
        </div>
      </Modal>
    )
  }
}
