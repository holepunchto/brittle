import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, configure }) {
    configure({ pick: 1 })

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
    configure({ pick: 0 })

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
    configure({ pick: 5 })

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
  { exitCode: 'error', stderr: { includes: '--pick 5 is out of range' } }
)

await spawner(
  function ({ test, skip, solo, configure }) {
    configure({ pick: 1 })

    skip('zeroth test', function (t) {
      t.fail('should not run')
    })

    test('only this one should run, even though it was marked skip', function (t) {
      t.pass()
    })

    solo('an unrelated solo test', function (t) {
      t.fail('should not run, pick should override other solos')
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

await spawner(
  function ({ test, configure }) {
    configure({ pick: [0, 2] })

    test('zeroth test should run', function (t) {
      t.pass()
    })

    test('first test should not run', function (t) {
      t.fail('should not run, not picked')
    })

    test('second test should run', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # zeroth test should run
      ok 1 - passed
  ok 1 - zeroth test should run # time = 0.613949ms

  # second test should run
      ok 1 - passed
  ok 2 - second test should run # time = 0.613949ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, skip, configure }) {
    configure({ name: 'network', pick: [0, 1] })

    test('network first', function (t) {
      t.pass('picked among matches')
    })

    test('database test', function (t) {
      t.fail('should not run, not matched')
    })

    skip('network second', function (t) {
      t.pass('picked among matches, pick overrides skip')
    })
  },
  `
  TAP version 13

  # network first
      ok 1 - picked among matches
  ok 1 - network first # time = 0.613949ms

  # network second
      ok 1 - picked among matches, pick overrides skip
  ok 2 - network second # time = 0.613949ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, configure, pause, resume }) {
    configure({ pick: [0, 5] })

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
  { exitCode: 'error', stderr: { includes: '--pick 5 is out of range' } }
)
