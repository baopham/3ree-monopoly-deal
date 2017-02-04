/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { parseToJxs } from '../../../../monopoly/logMessageParser'
import { actions } from '../../modules/gameHistory'
import type { GameHistoryState } from '../../modules/gameHistory'

type Props = {
  records: GameHistoryState,
  getRecentHistoryLogs: () => void
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

  componentDidMount () {
    this.props.getRecentHistoryLogs()
  }

  render () {
    const { records } = this.props

    return (
      <Panel header={<span>Log</span>}>
        <ListGroup fill style={styles.messageList}>
          {records.map(record =>
            <ListGroupItem key={record.id}>
              <p>
                <strong>{parseToJxs(record.message)}</strong>

                {!!record.playersToNotify.length &&
                  <small className='help-block'>
                    To users: {record.playersToNotify.join(', ')}
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

export default connect(mapStateToProps, actions)(GameHistoryLog)
