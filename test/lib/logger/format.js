var describe = require('mocha').describe
var beforeEach = require('mocha').beforeEach
var it = require('mocha').it
var expect = require('chai').expect
var proxyquire = require('proxyquire')

describe('lib/logger/format', function () {
  var format

  beforeEach(function () {
    format = proxyquire('../../../lib/logger/format', {
      cluster: {
        worker: {
          id: 'foo'
        }
      }
    })
  })

  it('should format string with request id', function () {
    var requestId = 'bar'

    var output = format({
      request: requestId,
      tags: []
    })

    expect(output).to.contain(requestId)
  })

  it('should format string without request id', function () {
    var requestId = 'bar'

    var output = format({
      tags: []
    })

    expect(output).to.not.contain(requestId)
  })

  it('should format string error as data', function () {
    var error = new Error('urk!')

    var output = format({
      tags: [],
      data: error
    })

    expect(output).to.contain(error.message)
  })

  it('should format string error message as data when no stack is present', function () {
    var error = new Error('urk!')
    delete error.stack

    var output = format({
      tags: [],
      data: error
    })

    expect(output).to.contain(error.message)
  })

  it('should format error as data when no stack or message is present', function () {
    var error = new Error('urk!')
    error.code = 'foo'
    delete error.stack
    delete error.message

    var output = format({
      tags: [],
      data: error
    })

    expect(output).to.contain(error.code)
  })

  it('should log as cluster master', function () {
    format = proxyquire('../../../lib/logger/format', {
      cluster: {}
    })

    var output = format({
      tags: [],
      data: 'hello'
    })

    expect(output).to.contain('master')
  })

  it('should invoke a function as data', function (done) {
    format = proxyquire('../../../lib/logger/format', {
      cluster: {}
    })

    format({
      tags: [],
      data: done
    })
  })

  it('should include a request id as id', function () {
    format = proxyquire('../../../lib/logger/format', {
      cluster: {}
    })

    var output = format({
      id: 'id',
      tags: [],
      data: 'hello'
    })

    expect(output).to.contain('id')
  })

  it('should format errors as json when configured to do so', function () {
    format = proxyquire('../../../lib/logger/format', {
      cluster: {},
      './config': {
        json: true
      }
    })

    var error = new Error('urk!')

    var output = format({
      tags: [],
      data: error
    })

    expect(output).to.contain(error.message)
  })
})
