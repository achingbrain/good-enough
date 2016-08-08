import test from 'ava'
import faker from 'faker'
import log from '../../handlers/log'
import LEVELS from '../../levels'

test('handlers/log should transform log event', (t) => {
  const event = {
    request: faker.random.uuid(),
    tags: [LEVELS.INFO, faker.lorem.words(1)],
    timestamp: new Date(),
    data: faker.lorem.sentence()
  }
  const ev = log(event)[0]

  t.is(process.pid, ev.pid)
  t.is(event.request, ev.request)
  t.is(LEVELS.INFO, ev.tags[0])
  t.is(event.tags[1], ev.tags[1])
  t.is(event.timestamp, ev.timestamp)
  t.is('log', ev.type)
  t.is(LEVELS.INFO, ev.level)
  t.is(event.data, ev.message)
})

test('handlers/log should transform log event where data is an Error', (t) => {
  const event = {
    request: faker.random.uuid(),
    tags: [LEVELS.INFO, faker.lorem.words(1)],
    timestamp: new Date(),
    data: new Error('Urk!')
  }
  const ev = log(event)[0]

  t.is(process.pid, ev.pid)
  t.is(event.request, ev.request)
  t.is(LEVELS.INFO, ev.tags[0])
  t.is(event.tags[1], ev.tags[1])
  t.is(event.timestamp, ev.timestamp)
  t.is('log', ev.type)
  t.is(LEVELS.INFO, ev.level)
  t.is(event.data.stack, ev.message)
})

test('handlers/log should transform log event where data is an Error with no stack trace', (t) => {
  const event = {
    request: faker.random.uuid(),
    tags: [LEVELS.INFO, faker.lorem.words(1)],
    timestamp: new Date(),
    data: new Error('Urk!')
  }
  delete event.data.stack
  const ev = log(event)[0]

  t.is(process.pid, ev.pid)
  t.is(event.request, ev.request)
  t.is(LEVELS.INFO, ev.tags[0])
  t.is(event.tags[1], ev.tags[1])
  t.is(event.timestamp, ev.timestamp)
  t.is('log', ev.type)
  t.is(LEVELS.INFO, ev.level)
  t.is(event.data.toString(), ev.message)
})
