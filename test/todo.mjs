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

    todo('redundant todo option is ignored', { todo: false }, function (t) {
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

  # redundant todo option is ignored
  ok 5 - redundant todo option is ignored # TODO

  1..5
  # tests = 5/5 pass
  # asserts = 2/2 pass
  # time = 3.31017ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ todo }) {
    todo('inverted todo')

    todo('inverted todo with ignored opts')
  },
  `
  TAP version 13

  # inverted todo
  ok 1 - inverted todo # TODO
  
  # inverted todo with ignored opts
  ok 2 - inverted todo with ignored opts # TODO

  1..2
  # tests = 2/2 pass
  # asserts = 0/0 pass
  # time = 3.318685ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
