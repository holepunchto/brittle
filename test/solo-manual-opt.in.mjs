import { spawner } from './helpers/index.js'

await spawner(
  function ({ solo, test }) {
    solo()

    test('skip this one', function (t) {
      t.pass()
    })

    solo('run this one', function (t) {
      t.pass()
    })

    test('skip this one', function (t) {
      t.pass()
    })

    solo('run this one', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # test

  # run this one
      ok 1 - passed
  ok 1 - run this one # time = 0.323537ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.797596ms

  # ok
  `,
  { exitCode: 0 }
)
