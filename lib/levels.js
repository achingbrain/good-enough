
var LogLevel = function LogLevelConstructor (name, level) {
  this.name = name
  this.level = level
}

LogLevel.prototype.toString = function LogLevelToString () {
  return this.name
}

LogLevel.prototype.isHigherPriority = function LogLevelCompare (other) {
  if (!other) {
    return true
  }

  return this.level >= other.level
}

var levels = {};

['DEBUG', 'INFO', 'WARN', 'ERROR'].forEach(function forEachLogLevel (name, level) {
  levels[name] = new LogLevel(name, level)
})

levels.fromString = function logLevelFromString (string) {
  if (!string) {
    return null
  }

  string = string.toString().toUpperCase()

  return levels[string]
}

module.exports = Object.freeze(levels)
