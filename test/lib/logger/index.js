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
      log: '*'
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

    logger = new Logger({

    })

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'log',
      tags: [LEVELS.DEBUG, 'foo']
    })

    expect(logHandler.called).to.be.false
  })

  it('should log high priority event', function (done) {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'log',
      tags: [LEVELS.WARN]
    })

    setImmediate(function () {
      expect(logHandler.called).to.be.true

      done()
    })
  })

  it('should survive untagged event', function (done) {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'log'
    })

    setImmediate(function () {
      expect(logHandler.called).to.be.false

      done()
    })
  })

  it('should survive event with no handler', function () {
    Logger.LEVEL = LEVELS.INFO

    var stream = through2.obj()

    logger = new Logger({
      foo: '*'
    })

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'foo'
    })

    expect(logHandler.called).to.be.false
  })
})
