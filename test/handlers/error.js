import test from 'ava'
import faker from 'faker'
import error from '../../handlers/error'
import LEVELS from '../../levels'

test('handlers/error should transform error event', (t) => {
  const event = {
    request: faker.random.uuid(),
    tags: [LEVELS.ERROR, faker.lorem.words(1)],
    timestamp: new Date(),
    error: {
      stack: 'stack'
    }
  }
  const ev = error(event)[0]

  t.is(process.pid, ev.pid)
  t.is(event.request, ev.request)
  t.is(LEVELS.ERROR, ev.tags[0])
  t.is(event.tags[1], ev.tags[1])
  t.is(event.timestamp, ev.timestamp)
  t.is('error', ev.type)
  t.is(LEVELS.ERROR, ev.level)
  t.is(event.error.stack, ev.message)
})

test('handlers/error should add error tag when not specified', (t) => {
  const event = {
    request: faker.random.uuid(),
    error: {
      stack: 'stack'
    }
  }
  const ev = error(event)[0]

  t.is(LEVELS.ERROR, ev.tags[0])
})

test('handlers/error should add timestamp when not specified', (t) => {
  const event = {
    error: {
      stack: 'stack'
    }
  }
  const ev = error(event)[0]

  t.truthy(ev.timestamp)
})

test('handlers/error should handle error without a stack', (t) => {
  const event = {
    error: {
      code: 'code'
    }
  }
  const ev = error(event)[0]

  t.truthy(ev.timestamp)
})
