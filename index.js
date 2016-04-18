'use strict'

const LEVELS = require('./levels')

module.exports = require('./logger')

for (const key in LEVELS) {
  module.exports[key] = LEVELS[key]
}

module.exports.logLevelFromString = LEVELS.fromString
