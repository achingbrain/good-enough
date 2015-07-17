var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')

describe('lib/logger/response', function () {
  var response

  beforeEach(function () {
    response = proxyquire('../../../lib/logger/response', {
      './format': sinon.stub().returnsArg(0)
    })
  })

  it('should log successful response event', function (done) {
    var event = {
      statusCode: 200,
      method: 'get',
      log: [],
      source: {
        remoteAddress: 'remoteAddress'
      }
    }

    response({
      push: function (ev) {
        expect(ev.tags).to.contain('response')
        expect(ev.method).to.equal('GET')

        done()
      }
    }, event)
  })

  it('should log user error response event', function (done) {
    var event = {
      statusCode: 401,
      method: 'get',
      log: [],
      source: {
        remoteAddress: 'remoteAddress'
      }
    }

    response({
      push: function (ev) {
        expect(ev.tags).to.contain('response')
        expect(ev.method).to.equal('GET')

        done()
      }
    }, event)
  })

  it('should log server error response event', function (done) {
    var event = {
      statusCode: 500,
      method: 'get',
      log: [],
      source: {
        remoteAddress: 'remoteAddress'
      }
    }

    response({
      push: function (ev) {
        expect(ev.tags).to.contain('response')
        expect(ev.method).to.equal('GET')

        done()
      }
    }, event)
  })

  it('should log informational response event', function (done) {
    var event = {
      statusCode: 100,
      method: 'get',
      log: [],
      source: {
        remoteAddress: 'remoteAddress'
      }
    }

    response({
      push: function (ev) {
        expect(ev.tags).to.contain('response')
        expect(ev.method).to.equal('GET')

        done()
      }
    }, event)
  })
})
