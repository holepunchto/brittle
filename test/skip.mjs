import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, skip }) {
    test('run this one', function (t) {
      t.pass()
    })

    skip('skip this one', function (t) {
      t.pass()
    })

    test('run this other one', function (t) {
      t.pass()
    })

    skip('skip this other one', function (t) {
      t.pass()
    })

    skip('redundant skip option is ignored', { skip: false }, function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # run this one
      ok 1 - passed
  ok 1 - run this one # time = 0.59497ms

  # skip this one
  ok 2 - skip this one # SKIP

  # run this other one
      ok 1 - passed
  ok 3 - run this other one # time = 0.052709ms

  # skip this other one
  ok 4 - skip this other one # SKIP

  # redundant skip option is ignored
  ok 5 - redundant skip option is ignored # SKIP

  1..5
  # tests = 5/5 pass
  # asserts = 2/2 pass
  # time = 3.388168ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ skip }) {
    const t = skip('inverted skip')
    t.pass()
    t.end()
  },
  '',
  { exitCode: 1, stderr: { includes: 'An inverted test cannot be skipped' } }
)

await spawner(
  function ({ skip }) {
    const t = skip('inverted skip with ignored opts', { skip: false })
    t.pass()
    t.end()
  },
  '',
  { exitCode: 1, stderr: { includes: 'An inverted test cannot be skipped' } }
)
