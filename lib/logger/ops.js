var format = require('./format')

module.exports = function ops (stream, event) {
  stream.push(format({
    timestamp: event.timestamp,
    pid: event.pid,
    tags: ['PERF', 'os'],
    data: JSON.stringify(event.os)
  }))
  stream.push(format({
    timestamp: event.timestamp,
    pid: event.pid,
    tags: ['PERF', 'proc'],
    data: JSON.stringify(event.proc)
  }))
  stream.push(format({
    timestamp: event.timestamp,
    pid: event.pid,
    tags: ['PERF', 'load'],
    data: JSON.stringify(event.load)
  }))
}
