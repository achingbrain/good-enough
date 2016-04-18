'use strict'

const through = require('through2')
const INFO = require('./levels').INFO
const Squeeze = require('good-squeeze').Squeeze
const toString = require('./transforms/to-string')
const waterfall = require('async/waterfall')
const os = require('os')

class Logger {
  constructor (events, options) {
    options = options || {}
    options.host = options.host || os.hostname()

    this.squeeze = new Squeeze(events)
    this.transforms = options.transforms || {
      toString: toString
    }
    this.transports = options.transports || {
      stdout: process.stdout
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

  init (stream, emitter, callback) {
    const self = this

    const normaliseEvent = through.obj((data, encoding, next) => {
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

      if (show && self.handlers[event]) {
        self.handlers[event](normaliseEvent, data)
      }

      return next()
    })

    const sendToTransports = through.obj((data, encoding, next) => {
      // don't block for logging
      next()

      self.transformAndTransportMessage(self.transports, data, encoding)
    })

    stream.pipe(this.squeeze).pipe(normaliseEvent).pipe(sendToTransports)

    callback()
  }

  transformAndTransportMessage (transports, data, encoding) {
    const self = this

    // make sure we can't change the incoming event
    const event = Object.freeze(data)

    Object.keys(transports).forEach((name) => {
      let transforms = transports[name].slice()
      const transport = transforms.pop()

      transforms = transforms.map((name) => {
        return self.transforms[name]
      })

      transforms.unshift(function (callback) {
        callback(null, event)
      })

      waterfall(transforms, (error, result) => {
        if (error) {
          return console.error(error)
        }

        transport(result, encoding, (error) => {
          if (error) {
            self.logLoggingError(transports, name, error)
          }
        })
      })
    })
  }

  logLoggingError (transports, failedTransport, error) {
    const self = this
    const otherTransports = {}

    Object.keys(transports)
    .forEach((name) => {
      if (name !== failedTransport) {
        otherTransports[name] = transports[name]
      }
    })

    if (Object.keys(otherTransports).length === 0) {
      // just print to the console
      return console.error(failedTransport, 'failed to log event and there were no other transports available:', error)
    }

    self.handlers.error({
      push: (event) => {
        self.transformAndTransportMessage(otherTransports, event)
      }
    }, {
      error: error
    })
  }
}

module.exports = Logger
module.exports.LEVEL = INFO
