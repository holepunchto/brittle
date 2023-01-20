import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test.configure({ source: true })

    test('classic test', function (t) {
      t.fail('custom')
    })
  },
  `
  TAP version 13

  # classic test
      not ok 1 - custom
        ---
        operator: fail
        stack: |
          [eval]:7:9
          Test._run (./index.js:573:13)
          process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        ...
  not ok 1 - classic test # time = 4.338771ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.609132ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function (test) {
    test.configure({ source: false })

    test('classic test', function (t) {
      t.fail('custom')
    })
  },
  `
  TAP version 13

  # classic test
      not ok 1 - custom
        ---
        operator: fail
        stack: |
          [eval]:7:9
          Test._run (./index.js:573:13)
          process.processTicksAndRejections (node:internal/process/task_queues:95:5)
        ...
  not ok 1 - classic test # time = 4.108373ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.453843ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function (test) {
    test.configure({ source: true })

    const t = test('inverted test')
    t.fail('custom')
    t.end()
  },
  `
  TAP version 13

  # inverted test
      not ok 1 - custom
        ---
        operator: fail
        stack: |
          _fn ([eval]:7:7)
          [eval]:11:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:313:38)
          node:internal/process/execution:79:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:78:60)
          node:internal/main/eval_string:28:3
        ...
  not ok 1 - inverted test # time = 4.413544ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.445664ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function (test) {
    test.configure({ source: false })

    const t = test('inverted test')
    t.fail('custom')
    t.end()
  },
  `
  TAP version 13

  # inverted test
      not ok 1 - custom
        ---
        operator: fail
        stack: |
          _fn ([eval]:7:7)
          [eval]:11:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:313:38)
          node:internal/process/execution:79:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:78:60)
          node:internal/main/eval_string:28:3
        ...
  not ok 1 - inverted test # time = 4.204022ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.205113ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
