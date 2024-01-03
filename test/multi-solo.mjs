import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, solo }) {
    test('skip this one', function (t) {
      t.pass()
    })

    solo('this solo is ran', function (t) {
      t.pass()
    })

    test('skip this other one', function (t) {
      t.pass()
    })

    solo('this solo is also ran', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # this solo is ran
    ok 1 - passed
  ok 1 - this solo is ran # time = 0.761623ms

  # this solo is also ran
      ok 1 - passed
  ok 2 - this solo is also ran # time = 0.06351ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 4.934907ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
