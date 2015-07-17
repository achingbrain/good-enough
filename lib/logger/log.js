var format = require('./format')

module.exports = function log (stream, event) {
  stream.push(format(event))
}
