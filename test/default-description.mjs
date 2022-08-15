import { spawner } from './helpers/index.js'

await spawner(
  async function (test) {
    const t = test()
    t.pass()

    const child = t.test()
    child.pass()
    child.end()

    t.end()

    test('classic', function (t) {
      t.pass()

      const child = t.test()
      child.pass()
      child.end()

      t.end()
    })
  },
  `
  TAP version 13

  # test
      ok 1 - passed
      ok 2 - passed
  ok 1 -  # time = 0.971015ms

  # classic
      ok 1 - passed
      ok 2 - passed
  ok 2 - classic # time = 0.167519ms

  1..2
  # tests = 2/2 pass
  # asserts = 4/4 pass
  # time = 3.901181ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
