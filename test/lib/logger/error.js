var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')
var ERROR = require('../../../lib/levels').ERROR

describe('lib/logger/error', function () {
  var error

  beforeEach(function () {
    error = proxyquire('../../../lib/logger/error', {
      './format': sinon.stub().returnsArg(0)
    })
  })

  it('should log event', function (done) {
    var event = {

    }

    error({
      push: function (ev) {
        expect(ev.tags).to.contain(ERROR)

        done()
      }
    }, event)
  })
})
