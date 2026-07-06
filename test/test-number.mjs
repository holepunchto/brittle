import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, configure }) {
    configure({ testNumber: 1 })

    test('zeroth test', function (t) {
      t.pass()
    })

    test('only this one should run', function (t) {
      t.pass()
    })

    test('second test', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # only this one should run
      ok 1 - passed
  ok 1 - only this one should run # time = 0.613949ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, hook, configure }) {
    configure({ testNumber: 0 })

    const state = { value: 0 }

    hook('setup state', function () {
      state.value = 42
    })

    test('first test', function (t) {
      t.is(state.value, 42, 'hook should still run for the selected test')
    })

    test('second test', function (t) {
      t.fail('should not run')
    })
  },
  `
  TAP version 13

  # setup state
  ok 1 - setup state # time = 0.216366ms

  # first test
      ok 1 - hook should still run for the selected test
  ok 2 - first test # time = 0.613949ms

  1..2
  # tests = 2/2 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, configure, pause, resume }) {
    configure({ testNumber: 5 })

    pause()

    test('only test A', function (t) {
      t.pass()
    })

    test('only test B', function (t) {
      t.pass()
    })

    resume()
  },
  `
  TAP version 13
  `,
  { exitCode: 'error', stderr: { includes: '--num 5 is out of range' } }
)

await spawner(
  function ({ test, skip, solo, configure }) {
    configure({ testNumber: 1 })

    skip('zeroth test', function (t) {
      t.fail('should not run')
    })

    test('only this one should run, even though it was marked skip', function (t) {
      t.pass()
    })

    solo('an unrelated solo test', function (t) {
      t.fail('should not run, num should override other solos')
    })
  },
  `
  TAP version 13

  # only this one should run, even though it was marked skip
      ok 1 - passed
  ok 1 - only this one should run, even though it was marked skip # time = 0.613949ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
