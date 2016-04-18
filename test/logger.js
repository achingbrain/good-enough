import test from 'ava'
import sinon from 'sinon'
import through2 from 'through2'
import LEVELS from '../levels'
import Logger from '../logger'
import util from 'util'

test('logger should refuse transports configured with nonexistent transforms', (t) => {
  t.throws(() => {
    new Logger({
      log: '*'
    }, {
      transports: {
        foo: ['non-existent', () => {}]
      }
    }).toString()
  })
})

test('logger should survive no options being passed', (t) => {
  const logger = new Logger({
    log: '*'
  })

  t.truthy(logger.transports.toString)
})

test.cb('logger should configure transports with transforms', (t) => {
  const stream = through2.obj()

  new Logger({
    log: '*'
  }, {
    transforms: {
      addWorld: (event, callback) => {
        callback(null, event.message + ' world')
      }
    },
    transports: {
      foo: ['addWorld', (chunk, encoding, callback) => {
        callback()
        t.is('hello world', chunk)
        t.end()
      }]
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'log',
    tags: [LEVELS.INFO],
    data: 'hello'
  })
})

test.cb('logger should configure multiple transports with transforms', (t) => {
  const stream = through2.obj()

  new Logger({
    log: '*'
  }, {
    transforms: {
      addHello: (event, callback) => {
        callback(null, 'hello ' + event.message)
      },
      addGoodbye: (event, callback) => {
        callback(null, 'goodbye ' + event.message)
      }
    },
    transports: {
      foo: ['addHello', (chunk, encoding, callback) => {
        callback()
        t.is('hello world', chunk)
        t.end()
      }]
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'log',
    tags: [LEVELS.INFO],
    data: 'world'
  })
})

test('logger should not log low priority event', (t) => {
  const logHandler = sinon.stub()
  const stream = through2.obj()

  Logger.LEVEL = LEVELS.INFO

  new Logger({
    log: '*'
  }, {
    transports: {
      foo: logHandler
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'log',
    tags: [LEVELS.DEBUG, 'foo']
  })

  t.false(logHandler.called)
})

test.cb('logger should log high priority event', (t) => {
  const stream = through2.obj()
  Logger.LEVEL = LEVELS.INFO

  new Logger({
    log: '*'
  }, {
    transports: {
      foo: () => {
        t.end()
      }
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'log',
    tags: [LEVELS.WARN, 'foo']
  })
})

test.cb('logger should not log unlistened for event', (t) => {
  const logHandler = sinon.stub()
  const stream = through2.obj()
  Logger.LEVEL = LEVELS.INFO

  new Logger({
    log: '*'
  }, {
    transports: {
      foo: logHandler
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'some-other-event',
    tags: [LEVELS.ERROR, 'foo']
  })

  setTimeout(() => {
    t.false(logHandler.called)
    t.end()
  }, 500)
})

test.cb('logger should survive untagged event', (t) => {
  const logHandler = sinon.stub()
  const stream = through2.obj()
  Logger.LEVEL = LEVELS.INFO

  new Logger({
    log: '*'
  }, {
    transports: {
      foo: logHandler
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'log'
  })

  setTimeout(() => {
    t.false(logHandler.called)
    t.end()
  }, 500)
})

test.cb('logger should survive event with no tags', (t) => {
  const logHandler = sinon.stub()
  const stream = through2.obj()
  Logger.LEVEL = LEVELS.INFO

  new Logger({
    log: '*'
  }, {
    transports: {
      foo: logHandler
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'log',
    tags: []
  })

  setTimeout(() => {
    t.false(logHandler.called)
    t.end()
  }, 500)
})

test.cb('logger pass error to other transport when logging fails', (t) => {
  const error = new Error('Urk!')
  const stream = through2.obj()

  let called = 0

  new Logger({
    request: '*'
  }, {
    transports: {
      faulty: function (chunk, encoding, callback) {
        callback(error)
      },
      fine: function (chunk, encoding, callback) {
        callback()
        called++

        if (chunk.toString().indexOf('Urk!') !== -1) {
          t.is(called, 1)
          t.end()
        }
      }
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'request',
    tags: [LEVELS.WARN]
  })
})

test.cb('logger should log error to console when only one transport is present and it fails to log', (t) => {
  const error = new Error('Urk!')
  const stream = through2.obj()
  const err = console.error

  console.error = function () {
    console.error = err

    const output = util.format.call(null, arguments)

    t.true(output.indexOf(error.message) !== -1)
    t.end()
  }

  new Logger({
    request: '*'
  }, {
    transports: {
      faulty: function (chunk, encoding, callback) {
        callback(error)
      }
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'request',
    tags: [LEVELS.WARN]
  })
})

test.cb('logger should log error when transforming an event fails', (t) => {
  const error = new Error('Urk!')
  const stream = through2.obj()
  const err = console.error

  console.error = function () {
    console.error = err

    const output = util.format.call(null, arguments)

    t.true(output.indexOf(error.message) !== -1)
    t.end()
  }

  new Logger({
    request: '*'
  }, {
    transforms: {
      faulty: function (event, callback) {
        callback(error)
      }
    }
  }).init(stream, null, sinon.stub())

  stream.push({
    event: 'request',
    tags: [LEVELS.WARN]
  })
})
