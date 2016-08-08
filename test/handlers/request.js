import test from 'ava'
import request from '../../handlers/request'
import LEVELS from '../../levels'

test('handlers/request should handle an actual error', (t) => {
  const error = new Error('Panic in the disco!')
  const event = {
    tags: [LEVELS.ERROR],
    data: error
  }
  const ev = request(event)[0]

  t.is(ev.message, error.stack)
})

test('handlers/request should handle an actual error without a stack trace', (t) => {
  const error = new Error('Panic in the disco!')
  delete error.stack
  const event = {
    tags: [LEVELS.ERROR],
    data: error
  }
  const ev = request(event)[0]

  t.is(ev.message, error.toString())
})

test('handlers/request should handle a boom error', (t) => {
  const event = {
    tags: [LEVELS.ERROR],
    data: {
      isBoom: true,
      output: {
        payload: {
          message: 'urk!'
        }
      }
    }
  }
  const ev = request(event)[0]

  t.is(ev.message, event.data.output.payload.message)
})

test('handlers/request should pass non-error event through', (t) => {
  const event = {
    tags: [LEVELS.INFO],
    data: 'foo'
  }
  const ev = request(event)[0]

  t.is(ev.message, event.data)
})
