import React from 'react'

const style = {
  width: 150,
  height: 230,
  border: '1px solid black'
}

export default class NoCard extends React.Component {
  render () {
    return (
      <div style={style} />
    )
  }
}

