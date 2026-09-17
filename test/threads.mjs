import { isBare } from 'which-runtime'
import { spawner } from './helpers/index.js'

if (!isBare) process.exit()

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 3 })
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    await brittle.load(require.resolve('./fixtures/threads/solo/heyworld.mjs'))
    await brittle.load(require.resolve('./fixtures/threads/solo/hiworld.js'))
  },
  `
  TAP version 13

  # hey world pre hook
      # hey world hook
  ok 1 - hey world pre hook # time = 0ms

  # hey world
      ok 1 - hey world
      ok 2 - hey world
      ok 3 - hey world
  ok 2 - hey world # time = 300ms

  # hi world
      ok 1 - hi world
      ok 2 - hi world
      ok 3 - hi world
  ok 3 - hi world # time = 300ms

  # hi world post hook
      # hi world hook
  ok 4 - hi world post hook # time = 0ms

  1..4
  # tests = 4/4 pass
  # asserts = 6/6 pass
  # time = 327ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (brittle) {
    brittle.configure({ bail: true, jobs: 3 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    await brittle.load(require.resolve('./fixtures/threads/bail/heyworld.mjs'))
    await brittle.load(require.resolve('./fixtures/threads/bail/hiworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # hello world
      ok 1 - hello world
      ok 2 - hello world
      ok 3 - hello world
  ok 1 - hello world # time = 301ms

  # failing hey world
      not ok 1 - failed
        ---
        operator: fail
        source: |
          test('failing hey world', (t) => {
            t.fail()
          ----^
          })
        stack: |
          Object.explain (./lib/errors.js:23:15)
          explain (./index.js:975:19)
          Test._fail (./index.js:515:25)
          ./test/fixtures/threads/bail/heyworld.mjs:4:5
          Test._run (./index.js:706:13)
        ...
  not ok 2 - failing hey world # time = 5ms

  # hi world
      ok 1 - hi world
      ok 2 - hi world
      ok 3 - hi world
  ok 3 - hi world # time = 301ms
  Bail out!
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 2 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/error/plan.js'))
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # plan
  Bail out! Unhandled rejection
  `,
  { exitCode: 1, stderr: { includes: 'Error: Test did not end (plan)' } }
)

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 2 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/error/timeout.js'))
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # timeout
  Bail out! Unhandled rejection
  `,
  { exitCode: 1, stderr: { includes: 'timed out after 10 ms' } }
)

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 2 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    await brittle.load(require.resolve('./fixtures/threads/error/thrown.js'))
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # hello world
      ok 1 - hello world
      ok 2 - hello world
      ok 3 - hello world
  ok 1 - hello world # time = 301ms

  # before thrown
      ok 1 - passed
  ok 2 - before thrown # time = 0ms

  # thrown
  Bail out! Unhandled rejection
  `,
  { exitCode: 1, stderr: { includes: 'Error: ERROR' } }
)

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 2 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/error/handled.js'))
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # handled
      ok 1 - should deep equal
  ok 1 - handled # time = 22ms

  # after handled
      ok 1 - passed
  ok 2 - after handled # time = 0ms

  # hello world
      ok 1 - hello world
      ok 2 - hello world
      ok 3 - hello world
  ok 3 - hello world # time = 303ms

  1..3
  # tests = 3/3 pass
  # asserts = 5/5 pass
  # time = 482ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 2 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/error/stray.js'))
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # stray
      ok 1 - passed
  ok 1 - stray # time = 11ms

  Bail out! Uncaught exception
  `,
  { exitCode: 1, stderr: { includes: 'Error: STRAY' } }
)

await spawner(
  async function (brittle) {
    brittle.configure({ jobs: 2 })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    await brittle.load(require.resolve('./fixtures/threads/error/exit.js'))
    await brittle.load(require.resolve('./fixtures/threads/helloworld.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # hello world
      ok 1 - hello world
      ok 2 - hello world
      ok 3 - hello world
  ok 1 - hello world # time = 301ms

  # before exit
      ok 1 - passed
  ok 2 - before exit # time = 0ms

  Bail out! Job exited without reporting results
  `,
  { exitCode: 1, stderr: '' }
)
