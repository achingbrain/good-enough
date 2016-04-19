'use strict'

const os = require('os')
const LEVELS = Object.keys(require('../levels'))
const ERROR = require('../levels').ERROR

module.exports = (stream, event) => {
  let message = event.data

  if (event.tags.indexOf(ERROR) !== -1) {
    if (message.isBoom) {
      message = message.output.payload.message
    } else {
      message = message.stack || message.toString()
    }
  }

  stream.push({
    host: os.hostname(),
    pid: process.pid,
    request: event.id,
    tags: event.tags,
    timestamp: event.timestamp || new Date(),
    type: 'request',
    level: event.tags.find((tag) => {
      return LEVELS.indexOf(tag.toString().toUpperCase()) !== -1
    }),

    message: message
  })
}
