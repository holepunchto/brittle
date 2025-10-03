import { tester } from './helpers/index.js'

await tester(
  'multiline fail message',
  function (t) {
    t.fail('this is\na multiline\nfail message')
  },
  `
  TAP version 13

  # multiline fail message
      not ok 1 - this is
a multiline
fail message
        ---
        operator: fail
        stack: |
          _fn ([eval]:10:7)
          processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - multiline fail message # time = 4.160992ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.252822ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'multiline fail message with stack trace',
  function (t) {
    const stack = [
      'Error: oh no',
      '    at _fn (/home/brittle/test/fail-multiline.mjs:4:15)',
      '    at Test._run (/home/brittle/index.js:597:13)',
      '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)'
    ]
    t.fail(stack.join('\n'))
  },
  `
  TAP version 13

  # multiline fail message with stack trace
    not ok 1 - Error: oh no
    at _fn (/home/brittle/test/fail-multiline.mjs:4:15)
    at Test._run (/home/brittle/index.js:597:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ---
        operator: fail
        stack: |
          _fn ([eval]:10:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 1 - multiline fail message with stack trace # time = 4.160992ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.252822ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'multiline fail message with Windows stack trace',
  function (t) {
    const stack = [
      'Error: oh no',
      '    at _fn (C:\\brittle\\test\\fail-multiline.mjs:4:15)',
      '    at Test._run (C:\\brittle\\index.js:597:13)',
      '    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)'
    ]
    t.fail(stack.join('\r\n'))
  },
  `
  TAP version 13

  # multiline fail message with Windows stack trace
    not ok 1 - Error: oh no
    at _fn (C:\\brittle\\test\\fail-multiline.mjs:4:15)
    at Test._run (C:\\brittle\\index.js:597:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ---
        operator: fail
        stack: |
          _fn ([eval]:10:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 1 - multiline fail message with Windows stack trace # time = 4.160992ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.252822ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
