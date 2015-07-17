var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var ERROR = require('../../../lib/levels').ERROR
var INFO = require('../../../lib/levels').INFO

describe('lib/logger/request', function () {
  var request
  var errorLogger

  beforeEach(function () {
    errorLogger = sinon.stub()

    request = proxyquire('../../../lib/logger/request', {
      './format': sinon.stub().returnsArg(0),
      './error': errorLogger
    })
  })

  it('should convert string stack trace back into error', function () {
    var error = new Error();

    var event = {
      tags: [ERROR],
      data: error.stack
    }

    request({}, event)

    expect(errorLogger.getCall(0).args[1].error).to.be.an('error')
  })

  it('should handle an actual error', function () {
    var error = new Error('Panic in the disco!')
    var event = {
      tags: [ERROR],
      data: error
    }

    request({}, event)

    expect(errorLogger.getCall(0).args[1].error).to.equal(error)
  })

  it('should pass non-error event through', function () {
    var event = {
      tags: [INFO],
      data: 'foo'
    }

    request({
      push: sinon.stub()
    }, event)

    expect(errorLogger.called).to.be.false
  })
})
