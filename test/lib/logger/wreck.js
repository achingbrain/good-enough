var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var sinon = require('sinon')
var expect = require('chai').expect
var proxyquire = require('proxyquire')

describe('lib/logger/wreck', function () {
  var wreck

  beforeEach(function () {
    wreck = proxyquire('../../../lib/logger/wreck', {
      './format': sinon.stub().returnsArg(0),
      './error': function (stream, event) {
        stream.push(event)
      }
    })
  })

  it('should log successful response event', function (done) {
    var event = {
      timeSpent: 10,
      request: {
        id: 'request-id',
        method: 'get',
        url: 'url'
      },
      response: {
        statusCode: 200
      }
    }

    wreck({
      push: function (ev) {
        expect(ev.tags).to.contain('wreck')
        expect(ev.request).to.equal(event.request.id)
        expect(ev.data).to.contain(event.response.statusCode)
        expect(ev.data).to.contain(event.timeSpent)
        expect(ev.data).to.contain(event.request.url)
        expect(ev.data).to.contain(event.request.method)

        done()
      }
    }, event)
  })

  it('should log unsuccessful response event', function (done) {
    var event = {
      timeSpent: 10,
      request: {
        id: 'request-id',
        method: 'get',
        url: 'url'
      },
      response: {
        statusCode: 404
      }
    }

    wreck({
      push: function (ev) {
        expect(ev.tags).to.contain('wreck')
        expect(ev.request).to.equal(event.request.id)
        expect(ev.data).to.contain(event.response.statusCode)
        expect(ev.data).to.contain(event.timeSpent)
        expect(ev.data).to.contain(event.request.url)
        expect(ev.data).to.contain(event.request.method)

        done()
      }
    }, event)
  })

  it('should log error response event', function (done) {
    var event = {
      timeSpent: 10,
      request: {
        id: 'request-id',
        method: 'get',
        url: 'url'
      },
      response: {
        statusCode: 500
      }
    }

    wreck({
      push: function (ev) {
        expect(ev.tags).to.contain('wreck')
        expect(ev.request).to.equal(event.request.id)
        expect(ev.data).to.contain(event.response.statusCode)
        expect(ev.data).to.contain(event.timeSpent)
        expect(ev.data).to.contain(event.request.url)
        expect(ev.data).to.contain(event.request.method)

        done()
      }
    }, event)
  })

  it('should log an error event', function (done) {
    var event = {
      timeSpent: 10,
      request: {
        id: 'request-id',
        method: 'get',
        url: 'url'
      },
      response: {},
      error: {
        message: 'message',
        stack: 'stack'
      }
    }

    wreck({
      push: function (ev) {
        expect(ev.tags).to.contain('wreck')
        expect(ev.request).to.equal(event.request.id)
        expect(ev.error.message).to.equal(event.error.message)
        expect(ev.error.stack).to.equal(event.error.stack)

        done()
      }
    }, event)
  })
})
