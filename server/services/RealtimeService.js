import r from 'rethinkdb'
import { connect } from './rethinkdb-util'

export default class RealtimeService {
  static liveUpdates(io, table, eventName) {
    console.log('Setting up listener...')
    connect()
      .then(conn => {
        r
          .table(table)
          .changes()
          .merge(() => ({ count: r.table(table).count() }))
          .run(conn, (err, cursor) => {
            console.log(`Listening for ${table} changes...`)
            cursor.each((err, change) => {
              console.log('Change detected', change)
              io.emit(eventName, change)
            })
          })
      })
  }
}
