var format = require('./format')
var chalk = require('chalk')
var util = require('util')
var error = require('./error')

var INFO = require('../levels').INFO
var ERROR = require('../levels').ERROR

module.exports = function wreck (stream, event) {
  if (event.error) {
    var err = new Error()

    for (var key in event.error) {
      err[key] = event.error[key]
    }

    err.method = event.request.method
    err.url = event.request.url

    return error(stream, {
      timestamp: event.timestamp,
      pid: event.pid,
      request: event.request.id,
      tags: [ERROR, 'wreck'],
      error: err
    })
  }

  var statusCode

  if (event.response.statusCode < 400) {
    statusCode = chalk.green(event.response.statusCode)
  } else if (event.response.statusCode < 500) {
    statusCode = chalk.yellow(event.response.statusCode)
  } else {
    statusCode = chalk.red(event.response.statusCode)
  }

  var data = util.format(
    '%s %s %s %sms',
    event.request.method,
    event.request.url,
    statusCode,
    event.timeSpent
  )

  stream.push(format({
    timestamp: event.timestamp,
    pid: event.pid,
    request: event.request.id,
    tags: [INFO, 'wreck'],
    data: data
  }))
}
