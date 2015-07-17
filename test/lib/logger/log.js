var describe = require('mocha').describe
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')

describe('lib/logger/log', function () {
  var log = proxyquire('../../../lib/logger/log', {
    './format': sinon.stub().returnsArg(0)
  })

  it('should log event', function (done) {
    var event = 'event'

    log({
      push: function (ev) {
        expect(ev).to.contain(event)

        done()
      }
    }, event)
  })
})
