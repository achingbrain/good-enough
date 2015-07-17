var chalk = require('chalk')
var format = require('./format')
var util = require('util')
var INFO = require('../levels').INFO

module.exports = function formatResponse (stream, event) {
  var requestLog = {
    tags: [INFO, 'response'],
    pid: event.pid,
    request: event.id,
    method: event.method.toUpperCase(),
    responseTime: event.responseTime,
    path: event.path
  }

  if (event.statusCode < 400) {
    requestLog.statusCode = chalk.green(event.statusCode)
  } else if (event.statusCode < 500) {
    requestLog.statusCode = chalk.yellow(event.statusCode)
  } else {
    requestLog.statusCode = chalk.red(event.statusCode)
  }

  requestLog.data = util.format(
    '%s %s %s %s %sms',
    event.source.remoteAddress,
    requestLog.method,
    requestLog.path,
    requestLog.statusCode,
    requestLog.responseTime
  )

  stream.push(format(requestLog))
}
