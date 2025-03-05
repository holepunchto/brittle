import { spawner } from './helpers/index.js'

await spawner(
  function ({ test }) {
    test('solo test', function (t) {
      t.test('first-child', function (t) {
        t.pass('should not print')
      })

      t.test('solo-child', { solo: true }, function (t) {
        t.pass('should print')
      })

      t.test('other-child', function (t) {
        t.pass('should not print')
      })
    })
  },
  `
  TAP version 13

  # solo test
      ok 1 - (solo-child) - should print
  ok 1 - solo test # time = 0.421411ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.813271ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test }) {
    test('skip test', function (t) {
      t.test('first-child', { skip: true }, function (t) {
        t.pass('should not print')
      })

      t.test('unskipped-child', function (t) {
        t.pass('should print')
      })

      t.test('other-child', { skip: true }, function (t) {
        t.pass('should not print')
      })
    })
  },
  `
  TAP version 13

  # skip test
      ok 1 - (unskipped-child) - should print
  ok 1 - skip test # time = 0.421411ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.813271ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test }) {
    test('todo test', function (t) {
      t.test('todo-child', { todo: true }, function (t) {
        t.pass('should not print')
      })

      t.test('normal-child', function (t) {
        t.pass('should print')
      })
    })
  },
  `
  TAP version 13

  # todo test
      ok 1 - (normal-child) - should print
  ok 1 - todo test # time = 0.421411ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.813271ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test }) {
    test('hook test', function (t) {
      t.test('hook-child', { hook: true }, function (t) {
        t.pass('should print even with a solo')
      })

      t.test('solo-child', { solo: true }, function (t) {
        t.pass('should print')
      })
    })
  },
  `
  TAP version 13

  # hook test
      ok 1 - (hook-child) - should print even with a solo
      ok 2 - (solo-child) - should print
  ok 1 - hook test # time = 0.421411ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.813271ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
