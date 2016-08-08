'use strict'

const os = require('os')
const ERROR = require('../levels').ERROR

module.exports = (event) => {
  return [{
    host: os.hostname(),
    pid: process.pid,
    request: event.request,
    tags: event.tags || [ERROR],
    timestamp: event.timestamp || new Date(),
    type: 'error',
    level: ERROR,

    message: event.error.stack ? event.error.stack : event.error.toString()
  }]
}
