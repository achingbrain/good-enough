import test from 'ava'
import overrideToString from '../../transforms/override-to-string'
import faker from 'faker'

test.cb('transforms/override-to-string should override toString', (t) => {
  const event = {
    request: faker.lorem.words(1),
    tags: [faker.lorem.words(1), faker.lorem.words(1)],
    pid: faker.lorem.words(1),
    method: faker.lorem.words(1),
    path: faker.lorem.words(1),
    statusCode: faker.lorem.words(1),
    message: faker.lorem.words(1),
    responseTime: faker.lorem.words(1)
  }

  overrideToString(event, (error, output) => {
    t.falsy(error)

    // should be a property and in the output of toString()
    t.is(output.request, event.request)
    t.true(output.toString().indexOf(event.request) !== -1)

    t.end()
  })
})
