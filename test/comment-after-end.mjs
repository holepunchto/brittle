import { tester } from './helpers/index.js'

await tester(
  'comment after end',
  function (t) {
    t.plan(1)
    t.is(1, 1)
    setImmediate(() => t.comment('test'))
  },
  `
  TAP version 13

  # comment after end
      ok 1 - should be equal
  ok 1 - comment after end # time = 0.716469ms
  `,
  { exitCode: 1, stderr: { includes: "Can't comment after end" } }
)
