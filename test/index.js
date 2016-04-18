import test from 'ava'
import logger from '../'

test('index should export something useful', (t) => {
  t.truthy(Object.keys(logger).length)
})
