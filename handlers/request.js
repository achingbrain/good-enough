'use strict'

const os = require('os')
const errorLogger = require('./error')
const ERROR = require('../levels').ERROR
const INFO = require('../levels').INFO

module.exports = (stream, event) => {
  if (event.tags.indexOf(ERROR) !== -1) {
    var error = event.data

    if (!(error instanceof Error)) {
      // convert string stack trace back into error message
      error = new Error(event.data.toString().split(/\n/)[0].trim())
      error.stack = event.data
    }

    return errorLogger(stream, {
      request: event.id,
      tags: event.tags,
      error: error
    })
  }

  stream.push({
    host: os.hostname(),
    pid: process.pid,
    request: event.request,
    tags: [INFO, 'request'],
    timestamp: event.timestamp || new Date(),
    type: 'request',
    level: INFO,

    message: event.data
  })
}
