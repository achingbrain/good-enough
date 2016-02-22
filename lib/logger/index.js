var through = require('through2')
var INFO = require('../levels').INFO
var ERROR = require('../levels').ERROR
var squeeze = require('good-squeeze').Squeeze
var format = require('./format')
var config = require('./config')

var HANDLERS = {
  log: require('./log'),
  request: require('./request'),
  response: require('./response'),
  error: require('./error'),
  wreck: require('./wreck'),
  ops: require('./ops')
}

var Logger = function Logger (events, options) {
  config(options)

  this.squeeze = squeeze(events)
  this.transports = config.transports || {
    stdout: process.stdout
  }
}

Logger.prototype.init = function init (stream, emitter, callback) {
  stream.pipe(this.squeeze).pipe(through.obj(function handleLogEvent (data, encoding, next) {
    var event = data.event

    var show = event === 'log' ? (data.tags || []).some(function forSomeTags (tag) {
      if (!tag.isHigherPriority) {
        return false
      }

      return tag.isHigherPriority(module.exports.LEVEL)
    }) : true

    if (data.event !== 'log') {
      show = true
    }

    if (show && HANDLERS[event]) {
      HANDLERS[event](this, data)
    }

    return next()
  })).pipe(through.obj(function streamOutput (transports, buffer, encoding, next) {
    // don't block for logging
    next()

    Object.keys(transports).forEach(function (name) {
      transports[name](buffer, encoding, function (error) {
        if (error) {
          logLoggingError(transports, name, error)
        }
      })
    })
  }.bind(null, this.transports)))

  callback()
}

// when one transport fails to log, pass the error to other transports
function logLoggingError (transports, failedTransport, error) {
  var otherTransports = Object.keys(transports).filter(function (name) {
    return name !== failedTransport
  }).map(function (name) {
    return transports[name]
  })

  if (otherTransports.length === 0) {
    // just print to the console
    return console.error(failedTransport, 'failed to log event and there were no other transports available:', error)
  }

  var errorString = format({
    timestamp: Date.now(),
    pid: process.pid,
    tags: [ERROR],
    data: error
  })

  otherTransports.forEach(function (transport) {
    transport(errorString, 'utf8', function () {
      // ignore errors that occur when logging errors
    })
  })
}

module.exports = Logger
module.exports.LEVEL = INFO
