import { tester } from './helpers/index.js'

await tester('multi-tick execution (promise resolve)',
  async function (t) {
    t.pass('first')
    await t.execution(new Promise((resolve) => { setTimeout(resolve, 100) }))
    t.pass('second')
  },
  `
  TAP version 13

  # multi-tick execution (promise resolve)
      ok 1 - first
      ok 2 - should resolve
      ok 3 - second
  ok 1 - multi-tick execution (promise resolve) # time = 103.513407ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 107.60935ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('multi-tick execution (promise reject)',
  async function (t) {
    t.pass('first')
    await t.execution(new Promise((resolve, reject) => setTimeout(() => reject(Error('test')), 100)))
    t.pass('second')
  },
  `
  TAP version 13

  # multi-tick execution (promise reject)
      ok 1 - first
      not ok 2 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        at: 
          line: 5
          column: 13
          file: /[eval]
        stack: |
          async _fn ([eval]:5:5)
          async Test._run (./index.js:565:7)
        ...
      ok 3 - second
  not ok 1 - multi-tick execution (promise reject) # time = 118.550599ms

  1..1
  # tests = 0/1 pass
  # asserts = 2/3 pass
  # time = 122.835187ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester('multi-tick exception (promise resolve)',
  async function (t) {
    t.pass('first')
    await t.exception(new Promise((resolve) => { setTimeout(resolve, 100) }))
    t.pass('second')
  },
  `
  TAP version 13

  # multi-tick exception (promise resolve)
      ok 1 - first
      not ok 2 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        at: 
          line: 5
          column: 13
          file: /[eval]
        stack: |
          async _fn ([eval]:5:5)
          async Test._run (./index.js:565:7)
        ...
      ok 3 - second
  not ok 1 - multi-tick exception (promise resolve) # time = 120.87336ms

  1..1
  # tests = 0/1 pass
  # asserts = 2/3 pass
  # time = 125.253356ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester('multi-tick exception (promise reject)',
  async function (t) {
    t.pass('first')
    await t.exception(new Promise((resolve, reject) => setTimeout(() => reject(Error('test')), 100)))
    t.pass('second')
  },
  `
  TAP version 13

  # multi-tick exception (promise reject)
      ok 1 - first
      ok 2 - should reject
      ok 3 - second
  ok 1 - multi-tick exception (promise reject) # time = 104.047078ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 108.391299ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('execution (promise resolve) without awaiting',
  function (t) {
    t.pass('first')
    t.execution(new Promise((resolve) => { setTimeout(resolve, 100) }))
    t.pass('second')
  },
  `
  TAP version 13

  # execution (promise resolve) without awaiting
      ok 1 - first
      ok 2 - second
      ok 3 - should resolve
  `,
  { exitCode: 1, stderr: { includes: 'Assertion after end' } }
)

await tester('execution (promise reject) without awaiting',
  function (t) {
    t.pass('first')
    t.execution(new Promise((resolve, reject) => setTimeout(() => reject(Error('test')), 100)))
    t.pass('second')
  },
  `
  TAP version 13

  # execution (promise reject) without awaiting
      ok 1 - first
      ok 2 - second
      not ok 3 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        at: 
          line: 5
          column: 7
          file: /[eval]
        stack: AssertionError [ERR_ASSERTION]: should resolve::
        ...
  `,
  { exitCode: 1, stderr: { includes: 'Assertion after end' } }
)

await tester('exception (promise resolve) without awaiting',
  function (t) {
    t.pass('first')
    t.exception(new Promise((resolve) => { setTimeout(resolve, 100) }))
    t.pass('second')
  },
  `
  TAP version 13

  # exception (promise resolve) without awaiting
      ok 1 - first
      ok 2 - second
      not ok 3 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        at: 
          line: 5
          column: 7
          file: /[eval]
        stack: AssertionError [ERR_ASSERTION]: should reject::
        ...
  `,
  { exitCode: 1, stderr: { includes: 'Assertion after end' } }
)

await tester('exception (promise reject) without awaiting',
  function (t) {
    t.pass('first')
    t.exception(new Promise((resolve, reject) => setTimeout(() => reject(Error('test')), 100)))
    t.pass('second')
  },
  `
  TAP version 13

  # exception (promise reject) without awaiting
      ok 1 - first
      ok 2 - second
      ok 3 - should reject
  `,
  { exitCode: 1, stderr: { includes: 'Assertion after end' } }
)
