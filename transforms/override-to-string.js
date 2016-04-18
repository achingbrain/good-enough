'use strict'

const format = require('./format')

module.exports = (event, callback) => {
  event = JSON.parse(JSON.stringify(event))
  event.toString = () => {
    return format(event)
  }

  callback(null, Object.freeze(event))
}
