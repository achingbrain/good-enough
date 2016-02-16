var format = require('./format')
var config = require('./config')
var moment = require('moment')
var pretty = require('prettysize')
var util = require('util')

module.exports = function ops (stream, event) {
  if (config.json) {
    stream.push(format({
      timestamp: event.timestamp,
      pid: event.pid,
      tags: ['PERF', 'system'],
      data: JSON.stringify(event.os)
    }))
    stream.push(format({
      timestamp: event.timestamp,
      pid: event.pid,
      tags: ['PERF', 'process'],
      data: JSON.stringify(event.proc)
    }))
    stream.push(format({
      timestamp: event.timestamp,
      pid: event.pid,
      tags: ['PERF', 'requests'],
      data: JSON.stringify(event.load)
    }))
  } else {
    stream.push(format({
      timestamp: event.timestamp,
      pid: event.pid,
      tags: ['PERF', 'system'],
      data: util.format('Load average: %s, Memory: %s of %s used, Uptime: %s',
        event.os.load.map(function (num) {
          return ' ' + parseFloat(num).toFixed(2)
        }).toString().trim().replace(/,/g, ''),
        pretty(event.os.mem.total - event.os.mem.free),
        pretty(event.os.mem.total),
        moment.duration(event.os.uptime * 1000).humanize()
      )
    }))
    stream.push(format({
      timestamp: event.timestamp,
      pid: event.pid,
      tags: ['PERF', 'process'],
      data: util.format('Uptime: %s, Heap: %s of %s used, RSS: %s, Delay: %sms',
        moment.duration(event.proc.uptime * 1000).humanize(),
        pretty(event.proc.mem.heapUsed),
        pretty(event.proc.mem.heapTotal),
        pretty(event.proc.mem.rss),
        parseFloat(event.proc.delay).toFixed(2)
      )
    }))

    Object.keys(event.load.requests).forEach(function (port) {
      stream.push(format({
        timestamp: event.timestamp,
        pid: event.pid,
        tags: ['PERF', 'requests'],
        data: util.format('Port: %s, Total: %d, Disconnects: %d, Status codes: %s, Concurrent: %d, Response times: average %sms, max %sms',
          port,
          event.load.requests[port].total,
          event.load.requests[port].disconnects,
          Object.keys(event.load.requests[port].statusCodes).map(function (code) {
            return ' ' + code + ': ' + event.load.requests[port].statusCodes[code]
          }).toString().trim() || '200: 0',
          event.load.concurrents[port],
          parseFloat(event.load.responseTimes[port].avg || 0).toFixed(2),
          parseFloat(event.load.responseTimes[port].max || 0).toFixed(2)
        )
      }))
    })
  }
}
