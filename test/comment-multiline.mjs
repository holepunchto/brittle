import { tester } from './helpers/index.js'

await tester(
  'multiline comment',
  function (t) {
    t.plan(1)
    t.comment('one', 'two')
    t.comment('first\n  indented\n')
    t.comment(42)
    t.comment()
    t.comment('trailing whitespace   ')
    t.pass()
  },
  `
  TAP version 13

  # multiline comment
      # one two
      # first
      #   indented
      # 42
      #
      # trailing whitespace
      ok 1 - passed
  ok 1 - multiline comment # time = 0.68674ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.545492ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'multiline\ntest name',
  function (t) {
    t.pass()
  },
  `
  TAP version 13

  # multiline
  # test name
      ok 1 - passed
  ok 1 - multiline
  test name # time = 0.68674ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.545492ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
