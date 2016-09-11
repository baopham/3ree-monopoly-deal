if (typeof window === 'undefined') {
  module.exports = require('./configureStore.server')
} else {
  module.exports = require('./configureStore.client')
}
