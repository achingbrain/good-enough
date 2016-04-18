import test from 'ava'
import LEVELS from '../levels'

test('levels should stringify levels', (t) => {
  t.is(LEVELS.INFO.toString(), 'INFO')
})

test('levels should prioritise levels high to low', (t) => {
  t.true(LEVELS.INFO.isHigherPriority(LEVELS.DEBUG))
})

test('levels should prioritise levels low to high', (t) => {
  t.false(LEVELS.DEBUG.isHigherPriority(LEVELS.INFO))
})

test('levels should prioritise levels when nothing to prioritise against', (t) => {
  t.true(LEVELS.DEBUG.isHigherPriority(null))
})

test('levels should create level from string', (t) => {
  t.is(LEVELS.fromString('INFO'), LEVELS.INFO)
})

test('levels should create level from null', (t) => {
  t.is(LEVELS.fromString(null), null)
})

test('levels should return string as JSON', (t) => {
  t.is(JSON.stringify({
    info: LEVELS.INFO
  }), '{"info":"INFO"}')
})
