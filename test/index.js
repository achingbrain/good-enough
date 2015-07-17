var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect
var logger = require('../')

describe('index', function () {
  it('should export something useful', function () {
    expect(Object.keys(logger)).to.not.be.empty
  })
})
