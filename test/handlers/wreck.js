import test from 'ava'
import wreck from '../../handlers/wreck'

test.cb('handlers/wreck should log successful response event', (t) => {
  const event = {
    timeSpent: 10,
    request: {
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
      t.is(ev.statusCode, event.response.statusCode)
      t.is(ev.responseTime, event.timeSpent)
      t.is(ev.path, event.request.url)
      t.is(ev.method, event.request.method)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log unsuccessful response event', (t) => {
  const event = {
    timeSpent: 10,
    request: {
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
      t.is(ev.statusCode, event.response.statusCode)
      t.is(ev.responseTime, event.timeSpent)
      t.is(ev.path, event.request.url)
      t.is(ev.method, event.request.method)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log error response event', (t) => {
  const event = {
    timeSpent: 10,
    request: {
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
      t.is(ev.statusCode, event.response.statusCode)
      t.is(ev.responseTime, event.timeSpent)
      t.is(ev.path, event.request.url)
      t.is(ev.method, event.request.method)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log an error event', (t) => {
  const event = {
    timeSpent: 10,
    request: {
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
      t.is(ev.message, event.error.stack)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log a client timeout', (t) => {
  const event = {
    request: {
      method: 'GET',
      url: 'url'
    },
    response: {},
    error: {
      message: 'Client request timeout'
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.statusCode, 504)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log a client error', (t) => {
  const event = {
    request: {
      method: 'GET',
      url: 'url'
    },
    response: {},
    error: {
      message: 'Client request error'
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.statusCode, 502)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log an unknown error', (t) => {
  const event = {
    request: {
      method: 'GET',
      url: 'url'
    },
    response: {},
    error: {
      message: 'Divvent knaa'
    }
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.statusCode, 500)
      t.end()
    }
  }, event)
})

test.cb('handlers/wreck should log a minimal error', (t) => {
  const event = {
    request: {
      method: 'GET',
      url: 'url'
    },
    error: 'Ah divvent knaa weor me troosers are'
  }

  wreck({
    push: function (ev) {
      t.true(ev.tags.indexOf('wreck') !== -1)
      t.is(ev.statusCode, 500)
      t.end()
    }
  }, event)
})
