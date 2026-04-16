import { isBare } from 'which-runtime'
import { spawner } from './helpers/index.js'

if (!isBare) process.exit()

await spawner(
  function (brittle) {
    brittle.threadRun(require.resolve('./fixtures/threads/solo/helloworld.js'))
    brittle.threadRun(require.resolve('./fixtures/threads/solo/heyworld.mjs'))
    brittle.threadRun(require.resolve('./fixtures/threads/solo/hiworld.js'))
  },
  `
  TAP version 13

  # hey world
      ok 1 - hey world
      ok 2 - hey world
      ok 3 - hey world
  ok 1 - hey world # time = 3002ms

  # hi world
      ok 1 - hi world
      ok 2 - hi world
      ok 3 - hi world
  ok 2 - hi world # time = 3002ms

  1..2
  # tests = 2/2 pass
  # asserts = 6/6 pass
  # time = 3018ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (brittle) {
    brittle.configure({ bail: true })
    brittle.threadRun(require.resolve('./fixtures/threads/bail/helloworld.js'))
    brittle.threadRun(require.resolve('./fixtures/threads/bail/heyworld.mjs'))
    brittle.threadRun(require.resolve('./fixtures/threads/bail/hiworld.js'))
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

  1..3
  # tests = 2/3 pass
  # asserts = 6/7 pass
  # time = 332ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function (brittle) {
    brittle.threadRun(require.resolve('./fixtures/threads/error/plan.js'))
  },
  `
  TAP version 13

  # plan
  `,
  { exitCode: 'error', stderr: { includes: 'Error: Test did not end (plan)' } }
)
