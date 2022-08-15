import { tester } from './helpers/index.js'

await tester('sync function allowed',
  function (t) {
    t.pass()
  },
  `
  TAP version 13

  # sync function allowed
      ok 1 - passed
  ok 1 - sync function allowed # time = 0.610103ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.531545ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
