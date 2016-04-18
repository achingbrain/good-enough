import test from 'ava'
import proxyquire from 'proxyquire'

test.cb('handlers/wreck should log successful response event', (t) => {
  const wreck = proxyquire('../../handlers/wreck', {
    './error': function (stream, event) {
      stream.push(event)
    }
  })

  const event = {
    timeSpent: 10,
    request: {
      id: 'request-id',
      method: 'GET',
      url: 'url'
    },
    response: {
      statusCode: 200
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.request, event.request.id)
      t.is(ev.statusCode, event.response.statusCode)
      t.is(ev.responseTime, event.timeSpent)
      t.is(ev.path, event.request.url)
      t.is(ev.method, event.request.method)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log unsuccessful response event', (t) => {
  const wreck = proxyquire('../../handlers/wreck', {
    './error': function (stream, event) {
      stream.push(event)
    }
  })

  const event = {
    timeSpent: 10,
    request: {
      id: 'request-id',
      method: 'GET',
      url: 'url'
    },
    response: {
      statusCode: 404
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.request, event.request.id)
      t.is(ev.statusCode, event.response.statusCode)
      t.is(ev.responseTime, event.timeSpent)
      t.is(ev.path, event.request.url)
      t.is(ev.method, event.request.method)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log error response event', (t) => {
  const wreck = proxyquire('../../handlers/wreck', {
    './error': function (stream, event) {
      stream.push(event)
    }
  })

  const event = {
    timeSpent: 10,
    request: {
      id: 'request-id',
      method: 'GET',
      url: 'url'
    },
    response: {
      statusCode: 500
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.request, event.request.id)
      t.is(ev.statusCode, event.response.statusCode)
      t.is(ev.responseTime, event.timeSpent)
      t.is(ev.path, event.request.url)
      t.is(ev.method, event.request.method)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log an error event', (t) => {
  const wreck = proxyquire('../../handlers/wreck', {
    './error': function (stream, event) {
      stream.push(event)
    }
  })

  const event = {
    timeSpent: 10,
    request: {
      id: 'request-id',
      method: 'GET',
      url: 'url'
    },
    response: {},
    error: {
      message: 'message',
      stack: 'stack'
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.request, event.request.id)
      t.is(ev.error.message, event.error.message)
      t.is(ev.error.stack, event.error.stack)
      t.end()
    }
  }, event)
})
