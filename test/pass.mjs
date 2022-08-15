import { tester, spawner } from './helpers/index.js'

await tester('classic no plan',
  function (t) {
    t.pass()
  },
  `
  TAP version 13

  # classic no plan
      ok 1 - passed
  ok 1 - classic no plan # time = 0.615021ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.48083ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('classic plan',
  function (t) {
    t.plan(1)
    t.pass()
  },
  `
  TAP version 13

  # classic plan
      ok 1 - passed
  ok 1 - classic plan # time = 0.618707ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.544497ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('classic plan w/comment',
  function (t) {
    t.plan(1, 'comment')
    t.pass()
  },
  `
  TAP version 13

  # classic plan w/comment
      ok 1 - passed
  ok 1 - classic plan w/comment # time = 0.615191ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.550167ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted no plan')
    t.pass()
    t.end()
  },
  `
  TAP version 13

  # inverted no plan
      ok 1 - passed
  ok 1 - inverted no plan # time = 0.674257ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.014978ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted plan')
    t.plan(1)
    t.pass()
    t.end()
  },
  `
  TAP version 13

  # inverted plan
      ok 1 - passed
  ok 1 - inverted plan # time = 0.665347ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.036878ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted plan w/comment')
    t.plan(1, 'comment')
    t.pass()
    t.end()
  },
  `
  TAP version 13

  # inverted plan w/comment
      ok 1 - passed
  ok 1 - inverted plan w/comment # time = 0.674377ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.086371ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
