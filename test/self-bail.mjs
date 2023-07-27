import { spawner } from './helpers/index.js'

await spawner(
  function ({ test }) {
    // Bails on first error by default

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
  ok 1 - success # time = 0.691659ms

  # fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          [eval]:11:9
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 2 - fail # time = 3.498153ms
  Bail out!

  1..2
  # tests = 1/2 pass
  # asserts = 1/2 pass
  # time = 7.370518ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function ({ test, configure }) {
    configure({ bail: false })

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
  ok 1 - success # time = 0.638924ms

  # fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          [eval]:11:9
          Test._run (./index.js:573:13)
          process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        ...
  not ok 2 - fail # time = 4.485711ms

  # success again
      ok 1 - passed
  ok 3 - success again # time = 0.061965ms

  1..3
  # tests = 2/3 pass
  # asserts = 2/3 pass
  # time = 8.934507ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
