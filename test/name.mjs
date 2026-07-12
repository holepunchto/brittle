import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, configure }) {
    configure({ name: 'network' })

    test('database test', function (t) {
      t.fail('should not run')
    })

    test('network test', function (t) {
      t.pass()
    })

    test('network retry test', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # network test
      ok 1 - passed
  ok 1 - network test # time = 0.613949ms

  # network retry test
      ok 1 - passed
  ok 2 - network retry test # time = 0.613949ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, hook, configure }) {
    configure({ name: 'first' })

    const state = { value: 0 }

    hook('setup state', function () {
      state.value = 42
    })

    test('first test', function (t) {
      t.is(state.value, 42, 'hook should still run for the matched test')
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
      ok 1 - hook should still run for the matched test
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
  function ({ test, configure }) {
    configure({ name: 'late' })

    test('early other test', function (t) {
      t.fail('should not run, even though the matching test is not registered yet')
    })

    setTimeout(function () {
      test('late matching test', function (t) {
        t.pass()
      })
    }, 10)
  },
  `
  TAP version 13

  # late matching test
      ok 1 - passed
  ok 1 - late matching test # time = 0.613949ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, configure, pause, resume }) {
    configure({ name: 'nonexistent' })

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

  1..0
  # tests = 0/0 pass
  # asserts = 0/0 pass
  # time = 3.9977ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, skip, configure }) {
    configure({ name: 'network', pick: 1 })

    test('network first', function (t) {
      t.fail('should not run, matched but not picked')
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

  # network second
      ok 1 - picked among matches, pick overrides skip
  ok 1 - network second # time = 0.613949ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, configure, pause, resume }) {
    configure({ name: 'network', pick: 2 })

    pause()

    test('network first', function (t) {
      t.pass()
    })

    test('network second', function (t) {
      t.pass()
    })

    test('database test', function (t) {
      t.pass()
    })

    resume()
  },
  `
  TAP version 13
  `,
  {
    exitCode: 'error',
    stderr: { includes: '--pick 2 is out of range (2 top-level test(s) matched --name "network", valid range 0-1)' }
  }
)

await spawner(
  function ({ test, skip, solo, configure }) {
    configure({ name: ['zeroth', 'second'] })

    test('zeroth test', function (t) {
      t.pass()
    })

    skip('second skipped test', function (t) {
      t.fail('should not run, --name should not override skip')
    })

    solo('an unrelated solo test', function (t) {
      t.fail('should not run, --name should override other solos')
    })

    test('second test', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # zeroth test
      ok 1 - passed
  ok 1 - zeroth test # time = 0.613949ms

  # second skipped test
  ok 2 - second skipped test # SKIP

  # second test
      ok 1 - passed
  ok 3 - second test # time = 0.613949ms

  1..3
  # tests = 3/3 pass
  # asserts = 2/2 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
