'use strict'

const os = require('os')
const LEVELS = Object.keys(require('../levels'))

module.exports = (event) => {
  var message = event.data

  if (message instanceof Error) {
    message = message.stack || message.toString()
  }

  return [{
    host: os.hostname(),
    pid: process.pid,
    request: event.request,
    tags: event.tags,
    timestamp: event.timestamp || new Date(),
    type: 'log',
    level: event.tags.find((tag) => {
      return LEVELS.indexOf(tag.toString().toUpperCase()) !== -1
    }),

    message: message
  }]
}
