# good-enough

[![Build Status](https://travis-ci.org/achingbrain/good-enough.svg?branch=master)](https://travis-ci.org/achingbrain/good-enough) [![Coverage Status](https://coveralls.io/repos/achingbrain/good-enough/badge.svg?branch=master&service=github)](https://coveralls.io/github/achingbrain/good-enough?branch=master) [![Dependency Status](https://david-dm.org/achingbrain/good-enough.svg)](https://david-dm.org/achingbrain/good-enough)

Sometimes you just want easily machine parseable `DEBUG`, `INFO`, `WARN`, `ERROR` style logging:

```sh
2015-07-16 16:53:22+0100 worker#2 30791 DEBUG my:request-handler request-id:51236 Hello world
```

The format is:

```sh
$TIME_STAMP $WORKER_ID $PID $LEVEL $CONTEXT $REQUEST_ID $MESSAGE
```

## Usage

First, register the logger:

```javascript
var Hapi = require('hapi')

var server = new Hapi.Server()
// ...
server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-enough'),
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
});
```

Then do some logging:

```javascript
var DEBUG = require('good-enough').DEBUG
var INFO = require('good-enough').INFO
var WARN = require('good-enough').WARN
var ERROR = require('good-enough').ERROR

// give some context to the logs
var CONTEXT = 'my:request-handler'

var requestHandler = function (request, reply) {
  request.log([INFO, CONTEXT], 'Hello world')

  request.log([WARN, CONTEXT], 'I can be a string')

  request.log([DEBUG, CONTEXT], function () {
    return 'If an expensive operation is needed for logging, wrap it in a function'.
  })
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
var logger = require('good-enough')
var DEBUG = require('good-enough').DEBUG
var INFO = require('good-enough').INFO

// show debug logs
logger.LEVEL = DEBUG

// now debug logs will be ignored
logger.LEVEL = INFO
```

## Log levels

It's possible to create the log level constants from strings:

```javascript
var logger = require('good-enough')
var INFO = require('good-enough').INFO

console.info(INFO === logger.logLevelFromString('INFO')) // true
```

## Specifying message output

By default all messages are printed to `process.stdout`.  To override this, pass a [`stream.Writeable`](https://nodejs.org/api/stream.html#stream_class_stream_writable) as `config.output`:

```javascript
var through = require('through2');

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-enough'),
      events: {
        // ...
      },
      config: {
        output: through(function (chunk, encoding, callback) {
          // do something with chunk/encoding and then call the callback
        })
      }
    }]
  }
});
```
