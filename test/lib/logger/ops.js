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
      os: {
        load: [1, 2, 3],
        mem: {}
      },
      load: {
        requests: {
          8080: {
            statusCodes: {
              200: 1
            }
          }
        },
        concurrents: {
          8080: 0
        },
        responseTimes: {
          8080: {}
        }
      },
      proc: {
        mem: {}
      }
    }
    var stream = {
      push: sinon.stub()
    }

    ops(stream, event)

    expect(stream.push.callCount).to.equal(3)
  })

  it('should log default status codes', function () {
    var event = {
      os: {
        load: [1, 2, 3],
        mem: {}
      },
      load: {
        requests: {
          8080: {
            statusCodes: {
            }
          }
        },
        concurrents: {
          8080: 0
        },
        responseTimes: {
          8080: {}
        }
      },
      proc: {
        mem: {}
      }
    }
    var stream = {
      push: sinon.stub()
    }

    ops(stream, event)

    expect(stream.push.getCall(2).args[0].data).to.contain('200: 0')
  })

  it('should log results in json format when configured to do so', function () {
    ops = proxyquire('../../../lib/logger/ops', {
      './format': sinon.stub().returnsArg(0),
      './config': {
        json: true
      }
    })

    var event = {
      os: {
        load: [],
        mem: {}
      },
      load: {
        requests: {
          8080: {
            statusCodes: {}
          }
        },
        concurrents: {
          8080: 0
        },
        responseTimes: {
          8080: {}
        }
      },
      proc: {
        mem: {}
      }
    }
    var stream = {
      push: sinon.stub()
    }

    ops(stream, event)

    expect(stream.push.callCount).to.equal(3)
    expect(stream.push.getCall(0).args[0].data).to.equal(JSON.stringify(event.os))
    expect(stream.push.getCall(1).args[0].data).to.equal(JSON.stringify(event.proc))
    expect(stream.push.getCall(2).args[0].data).to.equal(JSON.stringify(event.load))
  })
})
