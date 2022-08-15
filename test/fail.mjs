import { tester, spawner } from './helpers/index.js'

await tester('classic no plan',
  function (t) {
    t.fail()
  },
  `
  TAP version 13

  # classic no plan
      not ok 1 - failed
        ---
        operator: fail
        at: 
          line: 4
          column: 7
          file: /[eval]
        stack: |
          _fn ([eval]:4:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 1 - classic no plan # time = 4.160992ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.252822ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester('classic with plan',
  function (t) {
    t.plan(1)
    t.fail()
  },
  `
  TAP version 13

  # classic with plan
      not ok 1 - failed
        ---
        operator: fail
        at: 
          line: 5
          column: 7
          file: /[eval]
        stack: |
          _fn ([eval]:5:7)
          Test._run (./index.js:529:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 1 - classic with plan # time = 3.890772ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 6.864874ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted no plan')
    t.fail()
    t.end()
  },
  `
  TAP version 13

  # inverted no plan
      not ok 1 - failed
        ---
        operator: fail
        at: 
          line: 5
          column: 7
          file: /[eval]
        stack: |
          _fn ([eval]:5:7)
          [eval]:9:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
  not ok 1 - inverted no plan # time = 4.071748ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 6.450127ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted with plan')
    t.plan(1)
    t.fail()
    t.end()
  },
  `
  TAP version 13

  # inverted with plan
      not ok 1 - failed
        ---
        operator: fail
        at: 
          line: 6
          column: 7
          file: /[eval]
        stack: |
          _fn ([eval]:6:7)
          [eval]:10:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
  not ok 1 - inverted with plan # time = 4.063684ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 6.450968ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
