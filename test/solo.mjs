import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, solo }) {
    test('skip this one', function (t) {
      t.pass()
    })

    test('this test is skipped', function (t) {
      t.pass()
    })

    test('skip this other one', function (t) {
      t.pass()
    })

    solo('only one solo is ran', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # only one solo is ran
      ok 1 - passed
  ok 1 - only one solo is ran # time = 0.613949ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, solo }) {
    test('skip this one', function (t) {
      t.pass()
    })

    test('this test is skipped', function (t) {
      t.pass()
    })

    test('skip this other one', function (t) {
      t.pass()
    })

    solo('redundant solo option is ignored', { solo: false }, function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # redundant solo option is ignored
      ok 1 - passed
  ok 1 - redundant solo option is ignored # time = 0.613949ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
