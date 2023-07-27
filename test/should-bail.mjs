import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test('success', function (t) {
      t.pass()
    })

    test('fail', function (t) {
      t.fail()
    })

    test('success again', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # success
      ok 1 - passed
  ok 1 - success # time = 0.65909ms

  # fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          [eval]:9:9
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 2 - fail # time = 3.527995ms

  # success again
      ok 1 - passed
  ok 3 - success again # time = 0.062494ms

  1..3
  # tests = 2/3 pass
  # asserts = 2/3 pass
  # time = 7.795403ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)
