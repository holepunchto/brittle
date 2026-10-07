import { tester } from './helpers/index.js'

await tester(
  'actual/expected should show empty strings, objects, arrays, maps, sets, and unassigned array slots',
  function (t) {
    t.is({}, {})
    t.is([], [])
    t.is(new Set(), new Set())
    t.is('', 'nonempty')
    t.is('nonempty', '')
    t.is(new Map(), null)
    t.is(new WeakMap(), null)
    t.is(new WeakSet(), null)
    t.is(new Array(1), [])
  },
  `
  TAP version 13

  # actual/expected should show empty strings, objects, arrays, maps, sets, and unassigned array slots
      not ok 1 - should be equal
        ---
        actual: {}
        expected: {}
        operator: is
        stack: |
        ...
      not ok 2 - should be equal
        ---
        actual: []
        expected: []
        operator: is
        stack: |
        ...
      not ok 3 - should be equal
        ---
        actual: Set(0) {}
        expected: Set(0) {}
        operator: is
        stack: |
        ...
      not ok 4 - should be equal
        ---
        actual: ""
        expected: nonempty
        operator: is
        stack: |
        ...
      not ok 5 - should be equal
        ---
        actual: nonempty
        expected: ""
        operator: is
        stack: |
        ...
      not ok 6 - should be equal
        ---
        actual: Map(0) {}
        expected: null
        operator: is
        stack: |
        ...
      not ok 7 - should be equal
        ---
        actual: WeakMap {}
        expected: null
        operator: is
        stack: |
        ...
      not ok 8 - should be equal
        ---
        actual: WeakSet {}
        expected: null
        operator: is
        stack: |
        ...
      not ok 9 - should be equal
        ---
        actual:
          - undefined
        expected: []
        operator: is
        stack: |
        ...
  not ok 1 - actual/expected should show empty strings, objects, arrays, maps, sets, and unassigned array slots # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/9 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'actual/expected should distinguish empty and nonempty values for t.is, t.alike, and t.unlike',
  function (t) {
    t.is(new Set([1]), new Set())
    t.is({}, { value: 1 })
    t.alike([], [1])
    t.unlike(new Set(), new Set())
  },
  `
  TAP version 13

  # actual/expected should distinguish empty and nonempty values for t.is, t.alike, and t.unlike
      not ok 1 - should be equal
        ---
        actual:
          - 1
        expected: Set(0) {}
        operator: is
        stack: |
        ...
      not ok 2 - should be equal
        ---
        actual: {}
        expected:
          value: 1
        operator: is
        stack: |
        ...
      not ok 3 - should deep equal
        ---
        actual: []
        expected:
          - 1
        operator: alike
        stack: |
        ...
      not ok 4 - should not deep equal
        ---
        actual: Set(0) {}
        expected: Set(0) {}
        operator: unlike
        stack: |
        ...
  not ok 1 - actual/expected should distinguish empty and nonempty values for t.is, t.alike, and t.unlike # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/4 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'actual/expected should show empty values inside objects, arrays, and sets',
  function (t) {
    t.is({ array: [], set: new Set(), object: {}, string: '' }, null)
    t.is(null, { array: [], set: new Set(), object: {}, string: '' })
    t.is([[], new Set(), {}, ''], null)
    t.is(new Set([[], new Set(), {}, '']), null)
  },
  `
  TAP version 13

  # actual/expected should show empty values inside objects, arrays, and sets
      not ok 1 - should be equal
        ---
        actual:
          array: []
          set: Set(0) {}
          object: {}
          string: ""
        expected: null
        operator: is
        stack: |
        ...
      not ok 2 - should be equal
        ---
        actual: null
        expected:
          array: []
          set: Set(0) {}
          object: {}
          string: ""
        operator: is
        stack: |
        ...
      not ok 3 - should be equal
        ---
        actual:
          - []
          - Set(0) {}
          - {}
          - ""
        expected: null
        operator: is
        stack: |
        ...
      not ok 4 - should be equal
        ---
        actual:
          - []
          - Set(0) {}
          - {}
          - ""
        expected: null
        operator: is
        stack: |
        ...
  not ok 1 - actual/expected should show empty values inside objects, arrays, and sets # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/4 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'actual/expected should show undefined, null, false, and zero',
  function (t) {
    t.not(undefined, undefined)
    t.unlike(undefined, undefined)
    t.is(undefined, null)
    t.is(null, undefined)
    t.is(false, 0)
  },
  `
  TAP version 13

  # actual/expected should show undefined, null, false, and zero
      not ok 1 - should not be equal
        ---
        actual: undefined
        expected: undefined
        operator: not
        stack: |
        ...
      not ok 2 - should not deep equal
        ---
        actual: undefined
        expected: undefined
        operator: unlike
        stack: |
        ...
      not ok 3 - should be equal
        ---
        actual: undefined
        expected: null
        operator: is
        stack: |
        ...
      not ok 4 - should be equal
        ---
        actual: null
        expected: undefined
        operator: is
        stack: |
        ...
      not ok 5 - should be equal
        ---
        actual: false
        expected: 0
        operator: is
        stack: |
        ...
  not ok 1 - actual/expected should show undefined, null, false, and zero # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/5 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await tester(
  'actual/expected should be omitted for t.ok, t.absent, and t.fail',
  function (t) {
    t.ok(false)
    t.absent(true)
    t.fail()
  },
  `
  TAP version 13

  # actual/expected should be omitted for t.ok, t.absent, and t.fail
      not ok 1 - expected truthy value
        ---
        operator: ok
        stack: |
        ...
      not ok 2 - expected falsy value
        ---
        operator: absent
        stack: |
        ...
      not ok 3 - failed
        ---
        operator: fail
        stack: |
        ...
  not ok 1 - actual/expected should be omitted for t.ok, t.absent, and t.fail # time = 0ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/3 pass
  # time = 0ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
