import test from 'ava'
import proxyquire from 'proxyquire'
import format from '../../transforms/format'
import faker from 'faker'

test('transforms/format should format event properties', (t) => {
  const event = {
    request: faker.lorem.words(1),
    tags: [faker.lorem.words(1), faker.lorem.words(1)],
    pid: faker.lorem.words(1),
    method: faker.lorem.words(1),
    path: faker.lorem.words(1),
    statusCode: faker.lorem.words(1),
    message: faker.lorem.words(1),
    responseTime: faker.lorem.words(1)
  }

  const output = format(event)

  t.true(output.indexOf(event.request) !== -1)
  t.true(output.indexOf(event.tags[0]) !== -1)
  t.true(output.indexOf(event.tags[1]) !== -1)
  t.true(output.indexOf(event.pid) !== -1)
  t.true(output.indexOf(event.method) !== -1)
  t.true(output.indexOf(event.path) !== -1)
  t.true(output.indexOf(event.statusCode) !== -1)
  t.true(output.indexOf(event.message) !== -1)
  t.true(output.indexOf(event.responseTime) !== -1)
})

test('transforms/format should survive missing event properties', (t) => {
  const event = {
  }

  const output = format(event)

  t.true(output.length > 0)
})

test('transforms/format should log as cluster master', (t) => {
  const format = proxyquire('../../transforms/format', {
    cluster: {}
  })

  const output = format({
    tags: [],
    data: 'hello'
  })

  t.true(output.indexOf('master') !== -1)
})

test('transforms/format should log as cluster worker', (t) => {
  const format = proxyquire('../../transforms/format', {
    cluster: {
      worker: {
        id: 'foo'
      }
    }
  })

  const output = format({
    tags: [],
    data: 'hello'
  })

  t.true(output.indexOf('worker#foo') !== -1)
})

test('transforms/format should format warning status code', (t) => {
  const event = {
    statusCode: 404
  }

  const output = format(event)

  t.true(output.indexOf(event.statusCode) !== -1)
})

test('transforms/format should format success status code', (t) => {
  const event = {
    statusCode: 200
  }

  const output = format(event)

  t.true(output.indexOf(event.statusCode) !== -1)
})
