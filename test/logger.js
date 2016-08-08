import test from 'ava'
import sinon from 'sinon'
import LEVELS from '../levels'
import Logger from '../logger'
import util from 'util'

test('logger should refuse transports configured with nonexistent transforms', (t) => {
  t.throws(() => new Logger({
    events: {
      log: '*'
    },
    transports: {
      foo: ['non-existent', () => {}]
    }
  }))
})

test('logger should survive no options being passed', (t) => {
  const logger = new Logger()

  t.truthy(logger.transports.toString)
})

test.cb('logger should configure transports with transforms', (t) => {
  const stream = new Logger({
    events: {
      log: '*'
    },
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
  })

  stream.write({
    event: 'log',
    tags: [LEVELS.INFO],
    data: 'hello'
  })
})

test.cb('logger should configure multiple transports with transforms', (t) => {
  const stream = new Logger({
    events: {
      log: '*'
    },
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
  })

  stream.write({
    event: 'log',
    tags: [LEVELS.INFO],
    data: 'world'
  })
})

test('logger should not log low priority event', (t) => {
  Logger.LEVEL = LEVELS.INFO

  const logHandler = sinon.stub()
  const stream = new Logger({
    events: {
      log: '*'
    },
    transports: {
      foo: logHandler
    }
  })

  stream.write({
    event: 'log',
    tags: [LEVELS.DEBUG, 'foo']
  })

  t.false(logHandler.called)
})

test.cb('logger should log high priority event', (t) => {
  Logger.LEVEL = LEVELS.INFO
  const stream = new Logger({
    events: {
      log: '*'
    },
    transports: {
      foo: () => {
        t.end()
      }
    }
  })

  stream.write({
    event: 'log',
    tags: [LEVELS.WARN, 'foo']
  })
})

test.cb('logger should not log unlistened for event', (t) => {
  Logger.LEVEL = LEVELS.INFO
  const logHandler = sinon.stub()
  const stream = new Logger({
    events: {
      log: '*'
    },
    transports: {
      foo: logHandler
    }
  })

  stream.write({
    event: 'some-other-event',
    tags: [LEVELS.ERROR, 'foo']
  })

  setTimeout(() => {
    t.false(logHandler.called)
    t.end()
  }, 500)
})

test.cb('logger should survive untagged event', (t) => {
  Logger.LEVEL = LEVELS.INFO
  const logHandler = sinon.stub()
  const stream = new Logger({
    events: {
      log: '*'
    },
    transports: {
      foo: logHandler
    }
  })

  stream.write({
    event: 'log'
  })

  setTimeout(() => {
    t.false(logHandler.called)
    t.end()
  }, 500)
})

test.cb('logger should survive event with no tags', (t) => {
  Logger.LEVEL = LEVELS.INFO
  const logHandler = sinon.stub()
  const stream = new Logger({
    events: {
      log: '*'
    },
    transports: {
      foo: logHandler
    }
  })

  stream.write({
    event: 'log',
    tags: []
  })

  setTimeout(() => {
    t.false(logHandler.called)
    t.end()
  }, 500)
})

test.cb('logger pass error to other transport when logging fails', (t) => {
  let called = 0
  const error = new Error('Urk!')
  const stream = new Logger({
    events: {
      request: '*'
    },
    transports: {
      faulty: (chunk, encoding, callback) => {
        callback(error)
      },
      fine: (chunk, encoding, callback) => {
        callback()
        called++

        if (chunk.toString().indexOf('Urk!') !== -1) {
          t.is(called, 1)
          t.end()
        }
      }
    }
  })

  stream.write({
    event: 'request',
    tags: [LEVELS.WARN]
  })
})

test.cb('logger should log error to console when only one transport is present and it fails to log', (t) => {
  const error = new Error('Urk!')
  const err = console.error

  console.error = function () {
    console.error = err

    const output = util.format.call(null, arguments)

    t.true(output.indexOf(error.message) !== -1)
    t.end()
  }

  const stream = new Logger({
    events: {
      request: '*'
    },
    transports: {
      faulty: (chunk, encoding, callback) => {
        callback(error)
      }
    }
  })

  stream.write({
    event: 'request',
    tags: [LEVELS.WARN]
  })
})

test.cb('logger should log error when transforming an event fails', (t) => {
  const error = new Error('Urk!')
  const err = console.error

  console.error = function () {
    console.error = err

    const output = util.format.call(null, arguments)

    t.true(output.indexOf(error.message) !== -1)
    t.end()
  }

  const stream = new Logger({
    events: {
      request: '*'
    },
    transforms: {
      faulty: (event, callback) => {
        callback(error)
      }
    }
  })

  stream.write({
    event: 'request',
    tags: [LEVELS.WARN]
  })
})
