var format = require('./format')

var ERROR = require('../levels').ERROR

module.exports = function error (stream, event) {
  stream.push(format({
    timestamp: event.timestamp,
    pid: event.pid,
    request: event.request,
    tags: event.tags || [ERROR],
    data: event.error
  }))
}
