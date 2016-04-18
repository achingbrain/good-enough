'use strict'

const format = require('./format')

module.exports = (event, callback) => {
  callback(null, format(event))
}
