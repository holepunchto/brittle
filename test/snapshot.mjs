import { tester } from './helpers/index.js'
import { rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixturesDir = join(__dirname, 'fixtures')
const snapshotFile = join(fixturesDir, '_script.snapshot.cjs')
const scriptFile = join(__dirname, '_script.js')

rmSync(snapshotFile, { force: true })

// Initialize snapshots: basic snapshot
await tester('basic snapshot',
  function (t) {
    t.snapshot('hello world')
    t.snapshot({ foo: 'bar', num: 42 })
    t.snapshot([1, 2, 3])
  },
  `
  TAP version 13

  # basic snapshot
      ok 1 - should match snapshot
      ok 2 - should match snapshot
      ok 3 - should match snapshot
  ok 1 - basic snapshot # time = 0ms
  
  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Verify snapshots: basic snapshot
await tester('basic snapshot',
  function (t) {
    t.snapshot('hello world')
    t.snapshot({ foo: 'bar', num: 42 })
    t.snapshot([1, 2, 3])
  },
  `
  TAP version 13

  # basic snapshot
      ok 1 - should match snapshot
      ok 2 - should match snapshot
      ok 3 - should match snapshot
  ok 1 - basic snapshot # time = 0ms
 
  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: basic snapshot
await tester('basic snapshot',
  function (t) {
    t.snapshot('hello world')
    t.snapshot({ foo: 'different', num: 42 }) // This should fail
  },
  `
  TAP version 13

  # basic snapshot
      ok 1 - should match snapshot
      not ok 2 - should match snapshot
        ---
        actual: 
          foo: different
          num: 42
        expected: 
          foo: bar
          num: 42
        operator: snapshot
        source: |
              t.snapshot('hello world')
              t.snapshot({ foo: 'different', num: 42 }) // This should fail
          ------^
            })
        stack: |
          _fn (./test/_script.js:5:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      ...
  not ok 1 - basic snapshot # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 1/2 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { scriptFile }
)

rmSync(snapshotFile, { force: true })

// Initialize snapshots: typed array snapshots
await tester('typed array snapshots',
  function (t) {
    const uint8 = new Uint8Array([1, 2, 3, 4, 5])
    const uint16 = new Uint16Array([256, 512, 1024])
    const float32 = new Float32Array([1.5, 2.5, 3.14159])

    t.snapshot(uint8)
    t.snapshot(uint16)
    t.snapshot(float32)
  },
  `
  TAP version 13

  # typed array snapshots
      ok 1 - should match snapshot
      ok 2 - should match snapshot
      ok 3 - should match snapshot
  ok 1 - typed array snapshots # time = 0ms
  
  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Verify snapshots: typed array snapshots
await tester('typed array snapshots',
  function (t) {
    const uint8 = new Uint8Array([1, 2, 3, 4, 5])
    const uint16 = new Uint16Array([256, 512, 1024])
    const float32 = new Float32Array([1.5, 2.5, 3.14159])

    t.snapshot(uint8)
    t.snapshot(uint16)
    t.snapshot(float32)
  },
  `
  TAP version 13

  # typed array snapshots
      ok 1 - should match snapshot
      ok 2 - should match snapshot
      ok 3 - should match snapshot
  ok 1 - typed array snapshots # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: typed array snapshots
await tester('typed array snapshots',
  function (t) {
    const uint8 = new Uint8Array([1, 2, 3, 4, 5])
    const uint16 = new Uint16Array([256, 512, 1024])
    const float32 = new Float32Array([1.6, 2.5, 3.14159]) // Changed value to cause mismatch

    t.snapshot(uint8)
    t.snapshot(uint16)
    t.snapshot(float32)
  },
  `
  TAP version 13

  # typed array snapshots
      ok 1 - should match snapshot
      ok 2 - should match snapshot
      not ok 3 - should match snapshot
        ---
        actual: 
          0: 1.600000023841858
          1: 2.5
          2: 3.141590118408203
        expected: 
          0: 1.5
          1: 2.5
          2: 3.141590118408203
        operator: snapshot
        source: |
              t.snapshot(uint16)
              t.snapshot(float32)
          ------^
            })
        stack: |
          _fn (./test/_script.js:10:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - typed array snapshots # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 2/3 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { scriptFile }
)

rmSync(snapshotFile, { force: true })

// Initialize snapshots: buffer conversion to uint8array
await tester('buffer conversion to uint8array',
  function (t) {
    const buffer = Buffer.from([1, 2, 3, 4, 5])
    t.snapshot(buffer) // Should be converted to Uint8Array internally
  },
  `
  TAP version 13

  # buffer conversion to uint8array
      ok 1 - should match snapshot
  ok 1 - buffer conversion to uint8array # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '', env: { UPDATE_SNAPSHOTS: 'true' } },
  { scriptFile }
)

// Verify snapshots: buffer conversion to uint8array
await tester('buffer conversion to uint8array',
  function (t) {
    const buffer = Buffer.from([1, 2, 3, 4, 5])
    t.snapshot(buffer)
  },
  `
  TAP version 13

  # buffer conversion to uint8array
      ok 1 - should match snapshot
  ok 1 - buffer conversion to uint8array # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: buffer conversion to uint8array
await tester('buffer conversion to uint8array',
  function (t) {
    const buffer = Buffer.from([1, 2, 3, 4, 6]) // mismatch
    t.snapshot(buffer)
  },
  `
  TAP version 13

  # buffer conversion to uint8array
      not ok 1 - should match snapshot
        ---
        actual: 
          0: 1
          1: 2
          2: 3
          3: 4
          4: 6
        expected: 
          0: 1
          1: 2
          2: 3
          3: 4
          4: 5
        operator: snapshot
        source: |
              const buffer = Buffer.from([1, 2, 3, 4, 6]) // mismatch
              t.snapshot(buffer)
          ------^
            })
        stack: |
          _fn (./test/_script.js:5:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - buffer conversion to uint8array # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '', env: { UPDATE_SNAPSHOTS: 'false' } },
  { scriptFile }
)

rmSync(snapshotFile, { force: true })

// Initialize snapshots: multiple snapshots with the same message
await tester('multiple snapshots with the same message',
  function (t) {
    t.snapshot('first value', 'same message')
    t.snapshot('second value', 'same message')
    t.snapshot('third value', 'same message')
  },
  `
  TAP version 13

  # multiple snapshots with the same message
      ok 1 - same message
      ok 2 - same message
      ok 3 - same message
  ok 1 - multiple snapshots with the same message # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Verify snapshots: multiple snapshots with the same message
await tester('multiple snapshots with the same message',
  function (t) {
    t.snapshot('first value', 'same message')
    t.snapshot('second value', 'same message')
    t.snapshot('third value', 'same message')
  },
  `
  TAP version 13

  # multiple snapshots with the same message
      ok 1 - same message
      ok 2 - same message
      ok 3 - same message
  ok 1 - multiple snapshots with the same message # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: multiple snapshots with the same message
await tester('multiple snapshots with the same message',
  function (t) {
    t.snapshot('first value', 'same message')
    t.snapshot('second value', 'same message')
    t.snapshot('wrong value', 'same message') // mismatch
  },
  `
  TAP version 13

  # multiple snapshots with the same message
      ok 1 - same message
      ok 2 - same message
      not ok 3 - same message
        ---
        actual: wrong value
        expected: third value
        operator: snapshot
        source: |
              t.snapshot('second value', 'same message')
              t.snapshot('wrong value', 'same message') // mismatch
          ------^
            })
        stack: |
          _fn (./test/_script.js:6:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - multiple snapshots with the same message # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 2/3 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { scriptFile }
)

rmSync(snapshotFile, { force: true })

// Initialize snapshots: custom snapshot messages
await tester('custom snapshot messages',
  function (t) {
    t.snapshot('value1', 'custom message 1')
    t.snapshot('value2', 'custom message 2')
  },
  `
  TAP version 13

  # custom snapshot messages
      ok 1 - custom message 1
      ok 2 - custom message 2
  ok 1 - custom snapshot messages # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Verify snapshots: custom snapshot messages
await tester('custom snapshot messages',
  function (t) {
    t.snapshot('value1', 'custom message 1')
    t.snapshot('value2', 'custom message 2')
  },
  `
  TAP version 13

  # custom snapshot messages
      ok 1 - custom message 1
      ok 2 - custom message 2
  ok 1 - custom snapshot messages # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: custom snapshot messages
await tester('custom snapshot messages',
  function (t) {
    t.snapshot('value1', 'custom message 1')
    t.snapshot('wrong', 'custom message 2') // mismatch
  },
  `
  TAP version 13

  # custom snapshot messages
      ok 1 - custom message 1
      not ok 2 - custom message 2
        ---
        actual: wrong
        expected: value2
        operator: snapshot
        source: |
              t.snapshot('value1', 'custom message 1')
              t.snapshot('wrong', 'custom message 2') // mismatch
          ------^
            })
        stack: |
          _fn (./test/_script.js:5:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - custom snapshot messages # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 1/2 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { scriptFile }
)

rmSync(snapshotFile, { force: true })

// Initialize snapshots: complex nested objects
await tester('complex nested objects',
  function (t) {
    const complex = {
      string: 'test',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 'two', { three: 3 }],
      nested: {
        deep: {
          value: 'nested'
        }
      }
    }
    t.snapshot(complex)
  },
  `
  TAP version 13

  # complex nested objects
      ok 1 - should match snapshot
  ok 1 - complex nested objects # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Verify snapshots: complex nested objects
await tester('complex nested objects',
  function (t) {
    const complex = {
      string: 'test',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 'two', { three: 3 }],
      nested: {
        deep: {
          value: 'nested'
        }
      }
    }
    t.snapshot(complex)
  },
  `
  TAP version 13

  # complex nested objects
      ok 1 - should match snapshot
  ok 1 - complex nested objects # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: complex nested objects
await tester('complex nested objects',
  function (t) {
    const complex = {
      string: 'test',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 'two', { three: 3 }],
      nested: {
        deep: {
          value: 'wrong'
        }
      }
    }
    t.snapshot(complex)
  },
  `
  TAP version 13

  # complex nested objects
      not ok 1 - should match snapshot
        ---
        actual: 
          string: test
          number: 42
          boolean: true
          null: null
          array: 
            - 1
            - two
            - three: 3
          nested: 
            deep: 
              value: wrong
        expected: 
          string: test
          number: 42
          boolean: true
          null: null
          array: 
            - 1
            - two
            - three: 3
          nested: 
            deep: 
              value: nested
        operator: snapshot
        source: |
              }
              t.snapshot(complex)
          ------^
            })
        stack: |
          _fn (./test/_script.js:16:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - complex nested objects # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { scriptFile }
)

rmSync(snapshotFile, { force: true })

// Initialize snapshots: multiline strings use template literals
await tester('multiline strings use template literals',
  function (t) {
    const multiline = 'line 1\nline 2\nline 3'
    t.snapshot(multiline)
  },
  `
  TAP version 13

  # multiline strings use template literals
      ok 1 - should match snapshot
  ok 1 - multiline strings use template literals # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Verify snapshots: multiline strings use template literals
await tester('multiline strings use template literals',
  function (t) {
    const multiline = 'line 1\nline 2\nline 3'
    t.snapshot(multiline)
  },
  `
  TAP version 13

  # multiline strings use template literals
      ok 1 - should match snapshot
  ok 1 - multiline strings use template literals # time = 0ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 0ms

  # ok
  `,
  { exitCode: 0, stderr: '' },
  { scriptFile }
)

// Expect error on mismatch: multiline strings use template literals
await tester('multiline strings use template literals',
  function (t) {
    const multiline = 'line 1\nline 2\nline 4' // mismatch
    t.snapshot(multiline)
  },
  `
  TAP version 13

  # multiline strings use template literals
      not ok 1 - should match snapshot
        ---
        actual: |
          line 1
          line 2
          line 4
        expected: |
          line 1
          line 2
          line 3
        operator: snapshot
        source: |
              const multiline = 'line 1\\nline 2\\nline 4' // mismatch
              t.snapshot(multiline)
          ------^
            })
        stack: |
          _fn (./test/_script.js:5:7)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - multiline strings use template literals # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { scriptFile }
)
