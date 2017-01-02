/* @flow */
import React from 'react'

type Props = {
  show: boolean,
  bsBackground: 'default' | 'primary' | 'info' | 'success' | 'danger' | 'warning',
  children?: React$Element<*>
}

const styles = {
  show: {
    zIndex: 10000,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  hide: {
    display: 'none'
  }
}

export default class AlertBar extends React.Component {
  props: Props

  static defaultProps = {
    bsBackground: 'danger'
  }

  render () {
    const { show, children, bsBackground } = this.props
    const style = styles[show ? 'show' : 'hide']

    return (
      <div style={style} className={`bg-${bsBackground}`}>
        {children}
      </div>
    )
  }
}
