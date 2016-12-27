import React from 'react'
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap'

type Props = {
  records: GameHistoryRecord[]
}

const styles = {
  messageList: {
    height: 290,
    overflow: 'auto'
  }
}

export default class GameHistoryLog extends React.Component {
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
