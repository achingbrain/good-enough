var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var LEVELS = require('../../../lib/levels')
var through2 = require('through2')
var util = require('util')

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

  it('should override log destination', function (done) {
    var stream = through2.obj()

    var logger = new Logger({
      request: '*'
    }, {
      transports: {
        test: function (chunk, encoding, callback) {
          callback()
          done()
        }
      }
    })

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'request',
      tags: [LEVELS.WARN]
    })
  })

  it('should pass error to other transport when logging fails', function (done) {
    var error = new Error('Urk!')
    var stream = through2.obj()

    var called = 0

    var logger = new Logger({
      request: '*'
    }, {
      transports: {
        faulty: function (chunk, encoding, callback) {
          callback(error)
        },
        fine: function (chunk, encoding, callback) {
          callback()
          called++

          if (chunk.toString().indexOf('Urk!') !== -1) {
            expect(called).to.equal(1)
            done()
          }
        }
      }
    })

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'request',
      tags: [LEVELS.WARN]
    })
  })

  it('should log error to console when only one transport is present and it fails to log', function (done) {
    var error = new Error('Urk!')
    var stream = through2.obj()

    var err = console.error

    console.error = function () {
      console.error = err

      var string = util.format.call(null, arguments)

      expect(string).to.contain('Urk!')
      done()
    }

    var logger = new Logger({
      request: '*'
    }, {
      transports: {
        faulty: function (chunk, encoding, callback) {
          callback(error)
        }
      }
    })

    logger.init(stream, null, sinon.stub())

    stream.push({
      event: 'request',
      tags: [LEVELS.WARN]
    })
  })
})
