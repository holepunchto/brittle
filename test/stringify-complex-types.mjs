import { tester } from './helpers/index.js'

await tester(
  'stringify - resolved Promise shows value in t.is failure',
  function (t) {
    t.is(Promise.resolve(42), 'expected')
  },
  `
  TAP version 13

  # stringify - resolved Promise shows value in t.is failure
      not ok 1 - should be equal
        ---
        actual: Promise { 42 }
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - resolved Promise shows value in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - pending Promise shows pending in t.is failure',
  function (t) {
    t.is(new Promise(() => {}), 'expected')
  },
  `
  TAP version 13

  # stringify - pending Promise shows pending in t.is failure
      not ok 1 - should be equal
        ---
        actual: Promise { <pending> }
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - pending Promise shows pending in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - rejected Promise shows error in t.is failure',
  function (t) {
    const p = Promise.reject(new Error('oops'))
    p.catch(() => {}) // suppress unhandledRejection
    t.is(p, 'expected')
  },
  `
  TAP version 13

  # stringify - rejected Promise shows error in t.is failure
      not ok 1 - should be equal
        ---
        actual: Promise { <rejected> Error: oops }
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - rejected Promise shows error in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - Symbol shows type label in t.is failure',
  function (t) {
    t.is(Symbol('test'), 'expected')
  },
  `
  TAP version 13

  # stringify - Symbol shows type label in t.is failure
      not ok 1 - should be equal
        ---
        actual: Symbol(test)
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - Symbol shows type label in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - RegExp shows pattern in t.is failure',
  function (t) {
    t.is(/foo/gi, 'expected')
  },
  `
  TAP version 13

  # stringify - RegExp shows pattern in t.is failure
      not ok 1 - should be equal
        ---
        actual: /foo/gi
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - RegExp shows pattern in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - Date shows ISO string in t.is failure',
  function (t) {
    t.is(new Date('2024-01-01T00:00:00.000Z'), 'expected')
  },
  `
  TAP version 13

  # stringify - Date shows ISO string in t.is failure
      not ok 1 - should be equal
        ---
        actual: 2024-01-01T00:00:00.000Z
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - Date shows ISO string in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - Error shows message in t.is failure',
  function (t) {
    t.is(new Error('oops'), 'expected')
  },
  `
  TAP version 13

  # stringify - Error shows message in t.is failure
      not ok 1 - should be equal
        ---
        actual: Error: oops
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - Error shows message in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'stringify - Map shows type label in t.is failure',
  function (t) {
    t.is(new Map([['a', 1]]), 'expected')
  },
  `
  TAP version 13

  # stringify - Map shows type label in t.is failure
      not ok 1 - should be equal
        ---
        actual: Map(1) {}
        expected: expected
        operator: is
        stack: |
          _fn ([eval]:4:7)
          process.processTicksAndRejections (node:internal/process/task_queues:103:5)
        ...
  not ok 1 - stringify - Map shows type label in t.is failure # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
