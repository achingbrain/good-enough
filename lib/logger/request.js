var format = require('./format')
var errorLogger = require('./error')
var ERROR = require('../levels').ERROR

module.exports = function formatResponse (stream, event) {
  if (event.tags.indexOf(ERROR) !== -1) {
    var error = event.data

    if (!(error instanceof Error)) {
      // convert string stack trace back into error message
      error = new Error(event.data.toString().split(/\n/)[0].trim())
      error.stack = event.data
    }

    return errorLogger(stream, {
      timestamp: event.timestamp,
      pid: event.pid,
      id: event.id,
      tags: event.tags,
      error: error
    })
  }

  stream.push(format(event))
}
