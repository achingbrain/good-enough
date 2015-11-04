var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var LEVELS = require('../../../lib/levels')
var through2 = require('through2')

describe('lib/logger', function () {
  var Logger
  var logger
  var logHandler

  beforeEach(function () {
    logHandler = sinon.stub()
    Logger = proxyquire('../../../lib/logger', {
      './log': logHandler
    })
    logger = new Logger({
      log: '*',
      foo: '*'
    })
  })

  it('should not log low priority event', function () {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'log',
      tags: [LEVELS.DEBUG, 'foo']
    })

    expect(logHandler.called).to.be.false
  })

  it('should not log unlistened for event', function () {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'request',
      tags: [LEVELS.DEBUG, 'foo']
    })

    expect(logHandler.called).to.be.false
  })

  it('should log high priority event', function () {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'log',
      tags: [LEVELS.WARN]
    })

    expect(logHandler.called).to.be.true
  })

  it('should survive untagged event', function () {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'log'
    })

    expect(logHandler.called).to.be.true
  })

  it('should survive event with no handler', function () {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'foo'
    })

    expect(logHandler.called).to.be.false
  })
})
