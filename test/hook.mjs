import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, hook, solo }) {
    test('skip this one', function (t) {
      t.pass()
    })

    hook('this is a hook', function (t) {
      t.pass()
    })

    test('skip this other one', function (t) {
      t.pass()
    })

    solo('this solo is ran', function (t) {
      t.pass()
    })

    hook('this is another hook', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # this is a hook
    ok 1 - passed
  ok 1 - this is a hook # time = 0.761623ms

  # this solo is ran
      ok 1 - passed
  ok 2 - this solo is ran # time = 0.06351ms

  # this is another hook
      ok 1 - passed
  ok 3 - this is another hook # time = 0.116902ms

  1..3
  # tests = 3/3 pass
  # asserts = 3/3 pass
  # time = 4.934907ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, hook, skip }) {
    test('run this one', function (t) {
      t.pass()
    })

    hook('this is a hook', function (t) {
      t.pass()
    })

    skip('skip this other one', function (t) {
      t.pass()
    })

    hook('this is another hook', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # run this one
    ok 1 - passed
  ok 1 - run this one # time = 0.761623ms

  # this is a hook
      ok 1 - passed
  ok 2 - this is a hook # time = 0.06351ms

  # skip this other one
  ok 3 - skip this other one # SKIP

  # this is another hook
      ok 1 - passed
  ok 4 - this is another hook # time = 0.116902ms

  1..4
  # tests = 4/4 pass
  # asserts = 4/4 pass
  # time = 4.934907ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
