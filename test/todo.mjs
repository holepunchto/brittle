import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, todo }) {
    test('run this one', function (t) {
      t.pass()
    })

    todo('todo this one', function (t) {
      t.pass()
    })

    test('run this other one', function (t) {
      t.pass()
    })

    todo('todo this other one', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # run this one
      ok 1 - passed
  ok 1 - run this one # time = 0.639883ms

  # todo this one
  ok 2 - todo this one # TODO

  # run this other one
      ok 1 - passed
  ok 3 - run this other one # time = 0.059193ms

  # todo this other one
  ok 4 - todo this other one # TODO

  1..4
  # tests = 4/4 pass
  # asserts = 2/2 pass
  # time = 4.354851ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ todo }) {
    todo('inverted todo')
  },
  `
  TAP version 13

  # inverted todo
  ok 1 - inverted todo # TODO

  1..1
  # tests = 1/1 pass
  # asserts = 0/0 pass
  # time = 1.743833ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
