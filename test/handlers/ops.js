import test from 'ava'
import ops from '../../handlers/ops'

test('handlers/ops should transform ops event', (t) => {
  const event = {
    os: {
      load: [1, 2, 3],
      mem: {}
    },
    load: {
      requests: {
        8080: {
          statusCodes: {
            200: 1
          }
        }
      },
      concurrents: {
        8080: 0
      },
      responseTimes: {
        8080: {}
      }
    },
    proc: {
      mem: {}
    }
  }
  const ev = ops(event)

  t.is(ev.length, 3)
})

test('handlers/ops should log default status codes', (t) => {
  const event = {
    os: {
      load: [1, 2, 3],
      mem: {}
    },
    load: {
      requests: {
        8080: {
          statusCodes: {
          }
        }
      },
      concurrents: {
        8080: 0
      },
      responseTimes: {
        8080: {}
      }
    },
    proc: {
      mem: {}
    }
  }
  const ev = ops(event)

  t.truthy(ev[2].message.indexOf('200: 0') > -1)
})

test('handlers/ops should survive sparse load events', (t) => {
  const event = {
    os: {
      load: [1, 2, 3],
      mem: {}
    },
    load: {
      requests: {
        8080: {
        }
      }
    },
    proc: {
      mem: {}
    }
  }
  const ev = ops(event)

  t.truthy(ev[2].message.indexOf('200: 0') > -1)
})

test('handlers/ops should survive more sparse load events', (t) => {
  var event = {
    os: {
      load: [1, 2, 3],
      mem: {}
    },
    load: {
      requests: {
        8080: null
      }
    },
    proc: {
      mem: {}
    }
  }
  const ev = ops(event)

  t.truthy(ev[2].message.indexOf('200: 0') > -1)
})

test('handlers/ops should survive even more sparse load events', (t) => {
  var event = {
    os: {
      load: [1, 2, 3],
      mem: {}
    },
    load: {
      requests: null
    },
    proc: {
      mem: {}
    }
  }
  ops(event)
})
