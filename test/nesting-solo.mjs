import { spawner } from './helpers/index.js'

await spawner(
  async function (test) {
    test.test('subtest #1', function (child) {
      child.pass()
    })

    test.test('subtest #2', function (child) {
      child.pass()
    })

    test.test('subtest #3', { solo: true }, function (child) {
      child.pass()
    })

    test.test('subtest #4', function (child) {
      child.pass()
    })

    test.test('subtest #5', function (child) {
      child.pass()
    })

    test.test.solo('subtest #6', function (child) {
      child.pass()
    })
  },
  `
  TAP version 13

  # subtest #3
      ok 1 - passed
  ok 1 - subtest #3 # time = 0.207542ms

  # subtest #6
      ok 1 - passed
  ok 2 - subtest #3 # time = 0.207542ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 2.933333ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
