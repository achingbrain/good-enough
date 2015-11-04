var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect
var levels = require('../../lib/levels')

describe('lib/levels', function () {
  it('should stringify levels', function () {
    expect(levels.INFO.toString()).to.equal('INFO')
  })

  it('should prioritise levels high to low', function () {
    expect(levels.INFO.isHigherPriority(levels.DEBUG)).to.be.true
  })

  it('should prioritise levels low to high', function () {
    expect(levels.DEBUG.isHigherPriority(levels.INFO)).to.be.false
  })

  it('should prioritise levels when nothing to prioritise against', function () {
    expect(levels.DEBUG.isHigherPriority(null)).to.be.true
  })

  it('should create level from string', function () {
    expect(levels.fromString('INFO')).to.equal(levels.INFO)
  })

  it('should create level from null', function () {
    expect(levels.fromString()).to.equal(null)
  })
})
