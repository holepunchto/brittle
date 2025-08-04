import { spawner } from './helpers/index.js'

await spawner(
  async function (test) {
    test.test('subtest #1', function (child) {
      child.pass()
    })

    test.test('subtest #2', { skip: true }, function (child) {
      child.pass()
    })

    test.test.skip('subtest #3', function (child) {
      child.pass()
    })

    test.test('subtest #4', function (child) {
      child.pass()
    })
  },
  `
  TAP version 13

  # subtest #1
      ok 1 - passed
  ok 1 - subtest #1 # time = 0.213333ms

  # subtest #2
  ok 2 - subtest #2 # SKIP

  # subtest #3
  ok 3 - subtest #3 # SKIP

  # subtest #4
      ok 1 - passed
  ok 4 - subtest #4 # time = 0.025458ms

  1..4
  # tests = 4/4 pass
  # asserts = 2/2 pass
  # time = 2.997542ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
