'use strict'

const os = require('os')
const INFO = require('../levels').INFO

module.exports = (event) => {
  return [{
    host: os.hostname(),
    pid: process.pid,
    request: event.id,
    tags: [INFO, 'response'],
    timestamp: event.timestamp || new Date(),
    type: 'response',
    level: INFO,

    method: event.method.toUpperCase(),
    responseTime: event.responseTime,
    path: event.path,
    statusCode: event.statusCode,
    remoteAddress: event.source.remoteAddress
  }]
}
