var LEVELS = require('./lib/levels')

module.exports = require('./lib/logger')

for (var key in LEVELS) {
  module.exports[key] = LEVELS[key]
}

module.exports.logLevelFromString = LEVELS.fromString
