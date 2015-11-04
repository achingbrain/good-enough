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

var Logger = function Logger (events) {
  this.squeeze = squeeze(events)
}

Logger.prototype.init = function init (stream, emitter, callback) {
  stream.pipe(this.squeeze).pipe(Through.obj(function handleLogEvent (data, enc, next) {
    var event = data.event

    if (data.tags) {
      var show = data.tags.some(function forSomeTags (tag) {
        if (!tag.isHigherPriority) {
          return false
        }

        return tag.isHigherPriority(module.exports.LEVEL)
      })

      if (!show) {
        return next()
      }
    }

    if (HANDLERS[event]) {
      HANDLERS[event](this, data)
    }

    return next()
  })).pipe(process.stdout)

  callback()
}

module.exports = Logger
module.exports.LEVEL = INFO
