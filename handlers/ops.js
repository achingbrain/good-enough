'use strict'

const os = require('os')
const moment = require('moment')
const pretty = require('prettysize')
const util = require('util')
const INFO = require('../levels').INFO

module.exports = (event) => {
  const output = []

  output.push({
    host: os.hostname(),
    pid: process.pid,
    request: event.request,
    tags: [INFO, 'system'],
    timestamp: event.timestamp || new Date(),
    type: 'ops',
    level: INFO,

    message: util.format('Load average: %s, Memory: %s of %s used, Uptime: %s',
      event.os.load.map(function (num) {
        return ' ' + parseFloat(num).toFixed(2)
      }).toString().trim().replace(/,/g, ''),
      pretty(event.os.mem.total - event.os.mem.free),
      pretty(event.os.mem.total),
      moment.duration(event.os.uptime * 1000).humanize()
    )
  })
  output.push({
    host: os.hostname(),
    pid: process.pid,
    request: event.request,
    tags: [INFO, 'process'],
    timestamp: event.timestamp || new Date(),
    type: 'ops',
    level: INFO,

    message: util.format('Uptime: %s, Heap: %s of %s used, RSS: %s, Delay: %sms',
      moment.duration(event.proc.uptime * 1000).humanize(),
      pretty(event.proc.mem.heapUsed),
      pretty(event.proc.mem.heapTotal),
      pretty(event.proc.mem.rss),
      parseFloat(event.proc.delay).toFixed(2)
    )
  })

  if (event.load.requests) {
    Object.keys(event.load.requests).forEach((port) => {
      var requests = event.load.requests[port] || {}
      var statusCodes = requests.statusCodes || {}
      var responseTimes = (event.load.responseTimes || {})[port] || {}
      var concurrents = (event.load.concurrents || {})[port] || 0

      output.push({
        host: os.hostname(),
        pid: process.pid,
        request: event.request,
        tags: [INFO, 'requests'],
        timestamp: event.timestamp || new Date(),
        type: 'ops',
        level: INFO,

        message: util.format('Port: %s, Total: %d, Disconnects: %d, Status codes: %s, Concurrent: %d, Response times: average %sms, max %sms',
          port,
          requests.total,
          requests.disconnects,
          Object.keys(statusCodes).map((code) => {
            return ' ' + code + ': ' + statusCodes[code]
          }).toString().trim() || '200: 0',
          concurrents,
          parseFloat(responseTimes.avg || 0).toFixed(2),
          parseFloat(responseTimes.max || 0).toFixed(2)
        )
      })
    })
  }

  return output
}
