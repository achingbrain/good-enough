import test from 'ava'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import LEVELS from '../../levels'

test('handlers/request should convert string stack trace back into error', (t) => {
  const errorLogger = sinon.stub()
  const request = proxyquire('../../handlers/request', {
    './error': errorLogger
  })

  const error = new Error()

  const event = {
    tags: [LEVELS.ERROR],
    data: error.stack
  }

  request({}, event)

  t.true(errorLogger.getCall(0).args[1].error instanceof Error)
})

test('handlers/request should handle an actual error', (t) => {
  const errorLogger = sinon.stub()
  const request = proxyquire('../../handlers/request', {
    './format': sinon.stub().returnsArg(0),
    './error': errorLogger
  })

  const error = new Error('Panic in the disco!')
  const event = {
    tags: [LEVELS.ERROR],
    data: error
  }

  request({}, event)

  t.is(errorLogger.getCall(0).args[1].error, error)
})

test('handlers/request should pass non-error event through', (t) => {
  const errorLogger = sinon.stub()
  const request = proxyquire('../../handlers/request', {
    './format': sinon.stub().returnsArg(0),
    './error': errorLogger
  })

  const event = {
    tags: [LEVELS.INFO],
    data: 'foo'
  }

  request({
    push: sinon.stub()
  }, event)

  t.false(errorLogger.called)
})
