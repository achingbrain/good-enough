'use strict'

class LogLevel {
  constructor (name, level) {
    this.name = name
    this.level = level
  }

  toString () {
    return this.name
  }

  toJSON () {
    return this.toString()
  }

  isHigherPriority (other) {
    if (!other) {
      return true
    }

    return this.level >= other.level
  }
}

var levels = {};

['DEBUG', 'INFO', 'WARN', 'ERROR'].forEach((name, level) => {
  levels[name] = new LogLevel(name, level)
})

levels.fromString = (string) => {
  if (!string) {
    return null
  }

  string = string.toString().toUpperCase()

  return levels[string]
}

module.exports = Object.freeze(levels)
