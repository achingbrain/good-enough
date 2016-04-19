import test from 'ava'
import request from '../../handlers/request'
import LEVELS from '../../levels'

test.cb('handlers/request should handle an actual error', (t) => {
  const error = new Error('Panic in the disco!')
  const event = {
    tags: [LEVELS.ERROR],
    data: error
  }

  request({
    push: (e) => {
      t.is(e.message, error.stack)
      t.end()
    }
  }, event)
})

test.cb('handlers/request should handle an actual error without a stack trace', (t) => {
  const error = new Error('Panic in the disco!')
  delete error.stack
  const event = {
    tags: [LEVELS.ERROR],
    data: error
  }

  request({
    push: (e) => {
      t.is(e.message, error.toString())
      t.end()
    }
  }, event)
})

test.cb('handlers/request should handle a boom error', (t) => {
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

  request({
    push: (e) => {
      t.is(e.message, event.data.output.payload.message)
      t.end()
    }
  }, event)
})

test.cb('handlers/request should pass non-error event through', (t) => {
  const event = {
    tags: [LEVELS.INFO],
    data: 'foo'
  }

  request({
    push: (e) => {
      t.is(e.message, event.data)
      t.end()
    }
  }, event)
})
