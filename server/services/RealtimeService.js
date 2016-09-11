import thinky, { connect } from '../thinky'

const r = thinky.r

export default class RealtimeService {
  static liveUpdates (io, table, eventName) {
    console.log('Setting up listener...')
    connect()
      .then(conn => {
        return r
          .table(table)
          .changes()
          .merge(() => ({ count: r.table(table).count() }))
          .run(conn, (err, cursor) => {
            console.log(`Listening for ${table} changes...`)
            err && console.error(err)

            return cursor.each((err, change) => {
              console.log('Change detected', change)
              err && console.error(err)
              io.emit(eventName, change)
            })
          })
      })
  }
}
