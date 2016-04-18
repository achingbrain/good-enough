'use strict'

const os = require('os')
const levels = Object.keys(require('../levels'))

module.exports = (stream, event) => {
  var message = event.data

  if (message instanceof Error) {
    message = message.stack || message.toString()
  }

  stream.push({
    host: os.hostname(),
    pid: process.pid,
    request: event.request,
    tags: event.tags,
    timestamp: event.timestamp || new Date(),
    type: 'log',
    level: event.tags.find((tag) => {
      return levels.indexOf(tag.toString().toUpperCase()) !== -1
    }),

    message: message
  })
}
