'use strict'

const os = require('os')
const error = require('./error')
const INFO = require('../levels').INFO
const ERROR = require('../levels').ERROR

module.exports = (stream, event) => {
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

  stream.push({
    host: os.hostname(),
    pid: process.pid,
    request: event.request.id,
    tags: [INFO, 'wreck'],
    timestamp: event.timestamp || new Date(),
    type: 'wreck',
    level: INFO,

    method: event.request.method.toUpperCase(),
    responseTime: event.timeSpent,
    path: event.request.url,
    statusCode: event.response.statusCode,
    headers: event.response.headers
  })
}
