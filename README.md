# good-enough

[![Build Status](https://travis-ci.org/achingbrain/good-enough.svg?branch=master)](https://travis-ci.org/achingbrain/good-enough) [![Coverage Status](https://coveralls.io/repos/achingbrain/good-enough/badge.svg?branch=master&service=github)](https://coveralls.io/github/achingbrain/good-enough?branch=master) [![Dependency Status](https://david-dm.org/achingbrain/good-enough.svg)](https://david-dm.org/achingbrain/good-enough)

A multiple transport logging plugin that lets you apply arbitrary transforms to incoming log events.

Supports classic `DEBUG`, `INFO`, `WARN` and `ERROR` style logging.

## Usage

First, register the logger:

```javascript
const Hapi = require('hapi')

const server = new Hapi.Server()
// ...
server.register({
  register: Good,
  options: {
    reporters: {
      enough: {
        module: 'good-enough',
        args: [{
          events: {
            error: '*',
            log: '*',
            request: '*',
            response: '*',
            wreck: '*',
            ops: '*'
          }
        }]
      }
    }]
  }
})
```

Then do some logging:

```javascript
const DEBUG = require('good-enough').DEBUG
const INFO = require('good-enough').INFO
const WARN = require('good-enough').WARN
const ERROR = require('good-enough').ERROR

// give some context to the logs
const CONTEXT = 'my:request-handler'

const requestHandler = (request, reply) => {
  request.log([INFO, CONTEXT], 'Hello world')

  request.log([WARN, CONTEXT], `I can be template string: ${request.payload}`)
}
```

## Context

You should pass two tags with your log message - a level and some context.  If you don't pass these `good-enough` will assume that the log even is intended for a different reporter and ignore it.

```javascript
request.log([INFO, CONTEXT], 'Will be logged')
request.log(['some-other-tag'], 'Will not be logged')
```

## Setting the log level

`good-enough` supports the standard `DEBUG` < `INFO` < `WARN` < `ERROR` hierarchy.

It's possible to dynamically alter the log level:

```javascript
const logger = require('good-enough')
const DEBUG = require('good-enough').DEBUG
const INFO = require('good-enough').INFO

// show debug logs
logger.LEVEL = DEBUG

// now debug logs will be ignored
logger.LEVEL = INFO
```

## Log levels

It's possible to create the log level constants from strings:

```javascript
const logger = require('good-enough')
const INFO = require('good-enough').INFO

console.info(INFO === logger.logLevelFromString('INFO')) // true

console.info(INFO === logger.logLevelFromString('info')) // true (not case sensitive)
```

## Specifying message output

By default all messages are printed to `process.stdout`.  To override this, pass one or more functions as a hash to `config.transports`:

```javascript
const through = require('through2')

server.register({
  register: Good,
  options: {
    reporters: {
      enough: {
        module: 'good-enough',
        args: [{
          transports: {
            stdout: process.stdout.write.bind(process.stdout),
            custom: (chunk, encoding, callback) => {
              // do something with chunk/encoding and then call the callback
            }
          }
        }]
      }
    }]
  }
})
```

## Transforming messages

Be default events are formatted and turned into strings.  This has the side effect of losing information (log levels, timestamps, etc).

To define your own transforms, pass a `transforms` hash as an option:

```javascript
const through = require('through2')

server.register({
  register: Good,
  options: {
    reporters: {
      enough: {
        module: 'good-enough',
        args: [{
          events: {
            // ...
          },
          transforms: {
            toString: function (event, callback) {
              callback(null, JSON.stringify(event))
            }
          },
          transports: {
            // ...
          }
        }]
      }
    }]
  }
})
```

The first transform in the hash will be passed an event object which will have some or all of the following properties:

```javascript
{
  host: String, // defaults to `os.hostname()`
  pid: Number, // id of the current process
  request: String, // the id of the request that was in flight when this event was logged
  tags: Array,
  type: String, // 'wreck', 'request', 'response', 'ops', 'error' or 'log'
  timestamp: Date, // when the message was logged
  level: String, // 'INFO', 'WARN', 'ERROR' or 'DEBUG'

  // optional fields
  message: String, // a message
  context: String, // if `type` is log, the context you passed to `request.log`
  statusCode: Number, // if `type` is 'wreck' this is the response from the wreck request, if it is `response` it's the response from your app
  headers: Object // if `type` is 'wreck' this will be the response headers from the request
}
```

## Specifying which transforms to apply to transports

By default all transforms will be applied to an event in the order they are specified.  To override this, pass an array as a transport with the transport function being the last item in the array.

```javascript
server.register({
  register: Good,
  options: {
    reporters: {
      enough: {
        module: 'good-enough',
        args: [{
          events: {
            // ...
          },
          transforms: {
            toString: (event, callback) => {
              callback(null, JSON.stringify(event))
            },
            overrideHostName: (event, callback) => {
              event.host = 'foo'
              callback(null, event)
            }
          },
          transports: {
            // will have toString applied to all events before passing to stdout
            stdout: ['toString', process.stdout.write.bind(process.stdout)],
            // will not have the toString transform applied to any arguments
            stderr: process.stderr.write.bind(process.stdout),
            // will have overrideHostName and toString applied sequentially to all events
            stdout: ['overrideHostName', 'toString', (chunk, encoding, callback) => {
              // ... some code here
            }],
          }
        }]
      }
    }
  }
})
```

## Handling log events

There are a [default set of event handlers available](./handlers) but these can be overridden:

```javascript
server.register({
  register: Good,
  options: {
    reporters: {
      enough: {
        module: 'good-enough',
        args: [{
          events: {
            // ...
          },
          handlers: {
            error: (stream, event) => {
              // change `event` properties here

              stream.push(event)
            }
          }
        }]
      }
    }
  }
})
```
