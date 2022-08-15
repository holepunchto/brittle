import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test('classic test', function (t) {
      t.pass()
    })

    test.configure()
  },
  `
  TAP version 13

  # classic test
      ok 1 - passed
  ok 1 - classic test # time = 0.634787ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.572297ms

  # ok
  `,
  { exitCode: 0 }
)

await spawner(
  function (test) {
    test('classic test', function (t) {
      t.pass()
    })

    setImmediate(() => {
      test.configure()
    })
  },
  `
  TAP version 13

  # classic test
      ok 1 - passed
  ok 1 - classic test # time = 0.604742ms
  `,
  {
    stderr: { includes: 'Configuration must happen prior to registering any tests' },
    exitCode: 1
  }
)

await spawner(
  function (test) {
    const t = test('inverted test')
    t.pass()
    t.end()

    test.configure()
  },
  `
  TAP version 13

  # inverted test
      ok 1 - passed
  ok 1 - inverted test # time = 0.646337ms
  `,
  {
    stderr: { includes: 'Configuration must happen prior to registering any tests' },
    exitCode: 1
  }
)

await spawner(
  function (test) {
    const t = test('inverted test')
    t.pass()
    t.end()

    setImmediate(() => {
      test.configure()
    })
  },
  `
  TAP version 13

  # inverted test
      ok 1 - passed
  ok 1 - inverted test # time = 0.672834ms
  `,
  {
    stderr: { includes: 'Configuration must happen prior to registering any tests' },
    exitCode: 1
  }
)
