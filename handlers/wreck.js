'use strict'

const os = require('os')
const INFO = require('../levels').INFO
const ERROR = require('../levels').ERROR

module.exports = (stream, event) => {
  const tags = [INFO, 'wreck']
  let message = null
  let statusCode = event.response ? event.response.statusCode : 0

  if (event.error) {
    message = event.error.stack || event.error.message || event.error.toString()

    if (message.indexOf('Client request timeout') !== -1) {
      statusCode = 504
    } else if (message.indexOf('Client request error') !== -1 ||
    message.indexOf('Maximum redirections reached') !== -1 ||
    message.indexOf('Received redirection without location') !== -1) {
      statusCode = 502
    } else {
      statusCode = 500
    }

    tags[0] = ERROR
  }

  stream.push({
    host: os.hostname(),
    pid: process.pid,
    tags: tags,
    timestamp: event.timestamp || new Date(),
    type: 'wreck',
    level: tags[0],

    method: event.request.method.toUpperCase(),
    responseTime: event.timeSpent,
    path: event.request.url,
    statusCode: statusCode,
    headers: event.response ? event.response.headers : {},
    message: message
  })
}
