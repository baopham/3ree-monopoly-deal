import config from 'config'

const rethinkdbConfig = config.get('rethinkdb')
const thinky = require('thinky')(rethinkdbConfig)

export function connect () {
  return thinky.r.connect(rethinkdbConfig)
}

export default thinky
