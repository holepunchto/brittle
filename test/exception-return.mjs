import { tester } from './helpers/index.js'

await tester(
  'exception return',
  async function (t) {
    const error = new Error('test')

    const syncRes = await t.exception(() => {
      throw error
    })
    t.is(syncRes, error, 'should return Promise with the error')

    const asyncRes = await t.exception(async () => {
      await new Promise((resolve) => setImmediate(resolve))
      throw error
    })
    t.is(asyncRes, error, 'should return Promise with the error')

    const promiseRes = await t.exception(Promise.reject(error))
    t.is(promiseRes, error, 'should return Promise with the error')
  },
  `
TAP version 13

# exception return
    ok 1 - should throw
    ok 2 - should return Promise with the error
    ok 3 - should reject
    ok 4 - should return Promise with the error
    ok 5 - should reject
    ok 6 - should return Promise with the error
ok 1 - exception return # time = 0.801958ms

1..1
# tests = 1/1 pass
# asserts = 6/6 pass
# time = 3.303833ms

# ok
  `,
  { exitCode: 0, stderr: '' }
)
