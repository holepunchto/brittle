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
    const t = todo('inverted todo')
    t.pass()
    t.end()
  },
  '',
  { exitCode: 1, stderr: { includes: 'An inverted test cannot be marked as todo' } }
)
