var Through = require('through2')
var INFO = require('../levels').INFO
var squeeze = require('good-squeeze').Squeeze

var HANDLERS = {
  log: require('./log'),
  request: require('./request'),
  response: require('./response'),
  error: require('./error'),
  wreck: require('./wreck'),
  ops: require('./ops')
}

var Logger = function Logger (events, options) {
  options = options || {}

  this.squeeze = squeeze(events)
  this.output = options.output || process.stdout
}

Logger.prototype.init = function init (stream, emitter, callback) {
  stream.pipe(this.squeeze).pipe(Through.obj(function handleLogEvent (data, enc, next) {
    var event = data.event

    var show = data.event === 'log' ? (data.tags || []).some(function forSomeTags (tag) {
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
  })).pipe(this.output)

  callback()
}

module.exports = Logger
module.exports.LEVEL = INFO
