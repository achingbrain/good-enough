'use strict'

const moment = require('moment')
const cluster = require('cluster')
const chalk = require('chalk')
const ERROR = require('../levels').ERROR

const colourStatusCode = (statusCode) => {
  if (statusCode < 400) {
    return chalk.green(statusCode)
  } else if (statusCode < 500) {
    return chalk.yellow(statusCode)
  }

  return chalk.red(statusCode)
}

module.exports = (event) => {
  var args = [
    moment(event.timestamp || Date.now()).format('YYYY-MM-DD HH:mm:ssZZ'),
    chalk.magenta(cluster.worker ? 'worker#' + cluster.worker.id : 'master'),
    chalk.blue(event.pid)
  ]

  if (Array.isArray(event.tags)) {
    args.push(chalk.yellow(event.tags.join(' ')))
  }

  if (event.request) {
    args.push(chalk.cyan(event.request))
  }

  if (event.method) {
    args.push(event.method)
  }

  if (event.path) {
    args.push(event.path)
  }

  if (event.statusCode) {
    args.push(colourStatusCode(event.statusCode))
  }

  if (event.message) {
    args.push(event.tags.indexOf(ERROR) === -1 ? event.message : chalk.red(event.message))
  }

  if (event.responseTime) {
    args.push(event.responseTime + 'ms')
  }

  return args.join(' ').trim() + '\n'
}
