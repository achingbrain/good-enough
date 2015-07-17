var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')

describe('lib/logger/ops', function () {
  var ops

  beforeEach(function () {
    ops = proxyquire('../../../lib/logger/ops', {
      './format': sinon.stub().returnsArg(0)
    })
  })

  it('should log multiple events', function () {
    var event = {
      os: 'os',
      load: 'load',
      proc: 'proc'
    }
    var stream = {
      push: sinon.stub()
    }

    ops(stream, event)

    expect(stream.push.callCount).to.equal(3)
    expect(stream.push.getCall(0).args[0].data).to.equal('"os"')
    expect(stream.push.getCall(1).args[0].data).to.equal('"proc"')
    expect(stream.push.getCall(2).args[0].data).to.equal('"load"')
  })
})
