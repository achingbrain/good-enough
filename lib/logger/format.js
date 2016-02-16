var moment = require('moment')
var cluster = require('cluster')
var util = require('util')
var chalk = require('chalk')
var config = require('./config')

module.exports = function format (event) {
  var time = moment(event.timestamp || Date.now()).format('YYYY-MM-DD HH:mm:ssZZ')

  var message = event.data

  if (event.data instanceof Error) {
    if (config.json) {
      var err = {}

      // all enumerables and non enumerables
      Object.getOwnPropertyNames(event.data)
        .concat(Object.keys(event.data))
        .forEach(function forEachProperty (property) {
          err[property] = event.data[property]
        })

      message = JSON.stringify(err)
    } else {
      message = event.data.stack || event.data.message || event.data
    }

    message = chalk.red(message)
  }

  if (event.data instanceof Function) {
    message = event.data()
  }

  var args = [
    time,
    chalk.magenta(cluster.worker ? 'worker#' + cluster.worker.id : 'master'),
    chalk.blue(event.pid),
    chalk.yellow(event.tags.join(' '))
  ]

  if (event.request) {
    args.push(chalk.cyan(event.request))
  }

  if (event.id) {
    args.push(chalk.cyan(event.id))
  }

  args.push(message)
  args.push('\n')

  return util.format.apply(null, args)
}
