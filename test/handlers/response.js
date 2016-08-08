import test from 'ava'
import response from '../../handlers/response'

test('handlers/response should log successful response event', (t) => {
  const event = {
    statusCode: 200,
    method: 'get',
    log: [],
    source: {
      remoteAddress: 'remoteAddress'
    }
  }
  const ev = response(event)[0]

  t.true(ev.tags.indexOf('response') !== -1)
  t.is(ev.method, 'GET')
})

test('handlers/response should log user error response event', (t) => {
  const event = {
    statusCode: 401,
    method: 'get',
    log: [],
    source: {
      remoteAddress: 'remoteAddress'
    }
  }
  const ev = response(event)[0]

  t.true(ev.tags.indexOf('response') !== -1)
  t.is(ev.method, 'GET')
})

test('handlers/response should log server error response event', (t) => {
  const event = {
    statusCode: 500,
    method: 'get',
    log: [],
    source: {
      remoteAddress: 'remoteAddress'
    }
  }
  const ev = response(event)[0]

  t.true(ev.tags.indexOf('response') !== -1)
  t.is(ev.method, 'GET')
})

test('handlers/response should log informational response event', (t) => {
  const event = {
    statusCode: 100,
    method: 'get',
    log: [],
    source: {
      remoteAddress: 'remoteAddress'
    }
  }
  const ev = response(event)[0]

  t.true(ev.tags.indexOf('response') !== -1)
  t.is(ev.method, 'GET')
})
