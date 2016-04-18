import test from 'ava'
import faker from 'faker'
import error from '../../handlers/error'
import LEVELS from '../../levels'

test.cb('handlers/error should transform error event', (t) => {
  const event = {
    request: faker.random.uuid(),
    tags: [LEVELS.ERROR, faker.lorem.words(1)],
    timestamp: new Date(),
    error: {
      stack: 'stack'
    }
  }

  error({
    push: function (ev) {
      t.is(process.pid, ev.pid)
      t.is(event.request, ev.request)
      t.is(LEVELS.ERROR, ev.tags[0])
      t.is(event.tags[1], ev.tags[1])
      t.is(event.timestamp, ev.timestamp)
      t.is('error', ev.type)
      t.is(LEVELS.ERROR, ev.level)
      t.is(event.error.stack, ev.message)
      t.end()
    }
  }, event)
})

test.cb('handlers/error should add error tag when not specified', (t) => {
  const event = {
    request: faker.random.uuid(),
    error: {
      stack: 'stack'
    }
  }

  error({
    push: function (ev) {
      t.is(LEVELS.ERROR, ev.tags[0])
      t.end()
    }
  }, event)
})

test.cb('handlers/error should add timestamp when not specified', (t) => {
  const event = {
    error: {
      stack: 'stack'
    }
  }

  error({
    push: function (ev) {
      t.truthy(ev.timestamp)
      t.end()
    }
  }, event)
})

test.cb('handlers/error should handle error without a stack', (t) => {
  const event = {
    error: {
      code: 'code'
    }
  }

  error({
    push: function (ev) {
      t.truthy(ev.timestamp)
      t.end()
    }
  }, event)
})
