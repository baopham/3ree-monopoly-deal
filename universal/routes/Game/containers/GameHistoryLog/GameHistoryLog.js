/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import type { GameHistoryState } from '../../modules/gameHistory'

type Props = {
  records: GameHistoryState
}

const styles = {
  messageList: {
    height: 290,
    overflow: 'auto'
  }
}

const mapStateToProps = (state) => ({
  records: state.gameHistory
})

export class GameHistoryLog extends React.Component {
  props: Props

  render () {
    const { records } = this.props

    return (
      <Panel header='Logs'>
        <ListGroup fill style={styles.messageList}>
          {records.map(record =>
            <ListGroupItem key={record.id}>
              <p>
                <strong>{record.message}</strong>

                {!!record.notifyUsers.length &&
                  <small className='help-block'>
                    To users: {record.notifyUsers.join(', ')}
                  </small>
                }

                <small className='help-block'>
                  {record.createdAt}
                </small>
              </p>
            </ListGroupItem>
          )}
        </ListGroup>
      </Panel>
    )
  }
}

export default connect(mapStateToProps)(GameHistoryLog)
