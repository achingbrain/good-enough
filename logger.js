'use strict'

const INFO = require('./levels').INFO
const toString = require('./transforms/to-string')
const waterfall = require('async/waterfall')
const os = require('os')
const Stream = require('stream')

class Logger extends Stream.Transform {
  constructor (options) {
    super({
      objectMode: true
    })

    options = options || {}
    options.host = options.host || os.hostname()

    this.events = options.events || {
      error: '*',
      log: '*',
      request: '*',
      response: '*',
      wreck: '*',
      ops: '*'
    }

    this.transforms = options.transforms || {
      toString: toString
    }
    this.transports = options.transports || {
      stdout: process.stdout.write.bind(process.stdout)
    }

    var transforms = Object.keys(this.transforms)

    for (var key in this.transports) {
      var transport = this.transports[key]

      if (Array.isArray(transport)) {
        transport
          .slice(0, -1)
          .forEach((transform) => {
            if (transforms.indexOf(transform) === -1) {
              throw new Error('Transport ' + key + ' specifed transform ' + transform + ' to be applied but no such transform exists! Available transforms: ' + transforms)
            }
          })

        continue
      }

      this.transports[key] = transforms.concat(transport)
    }

    options.handlers = options.handlers || {}

    this.handlers = {
      log: options.handlers.log || require('./handlers/log'),
      request: options.handlers.request || require('./handlers/request'),
      response: options.handlers.response || require('./handlers/response'),
      error: options.handlers.error || require('./handlers/error'),
      wreck: options.handlers.wreck || require('./handlers/wreck'),
      ops: options.handlers.ops || require('./handlers/ops')
    }
  }

  _transform (data, encoding, next) {
    var event = data.event

    var show = event === 'log' ? (data.tags || []).some((tag) => {
      if (!tag.isHigherPriority) {
        return false
      }

      return tag.isHigherPriority(module.exports.LEVEL)
    }) : true

    if (data.event !== 'log') {
      show = true
    }

    if (!this.events[data.event]) {
      show = false
    }

    if (show && this.handlers[event]) {
      this.handlers[event](data).forEach((event) => {
        this.transformAndTransportMessage(this.transports, event, encoding)
      })
    }

    return next()
  }

  transformAndTransportMessage (transports, data, encoding) {
    // make sure we can't change the incoming event
    const event = Object.freeze(data)

    // apply each transform to the event before passing it to the transport
    Object.keys(transports).forEach((name) => {
      let transforms = transports[name].slice()
      const transport = transforms.pop()

      transforms = transforms.map((name) => this.transforms[name])

      transforms.unshift((callback) => {
        callback(null, event)
      })

      waterfall(transforms, (error, result) => {
        if (error) {
          return console.error(error)
        }

        transport(result, encoding, (error) => {
          if (error) {
            this.logLoggingError(name, error, encoding)
          }
        })
      })
    })
  }

  logLoggingError (failedTransport, error, encoding) {
    const otherTransports = {}

    Object.keys(this.transports).forEach((name) => {
      if (name !== failedTransport) {
        otherTransports[name] = this.transports[name]
      }
    })

    if (Object.keys(otherTransports).length === 0) {
      // just print to the console
      return console.error(failedTransport, 'failed to log event and there were no other transports available:', error)
    }

    const event = this.handlers.error({
      error: error
    })[0]

    this.transformAndTransportMessage(otherTransports, event, encoding)
  }
}

module.exports = Logger
module.exports.LEVEL = INFO
