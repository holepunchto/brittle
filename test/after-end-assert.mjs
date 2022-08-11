import { tester, spawner } from './helpers/index.js'

await tester('assert after end',
  function (t) {
    t.pass()
    t.end()
    t.pass()
  },
  `
  TAP version 13

  # assert after end
      ok 1 - passed
      ok 2 - passed
      not ok 3 - assertion after end
  not ok 1 - assert after end # time = 0.717958ms

  1..1
  # tests = 0/1 pass
  # asserts = 2/3 pass
  # time = 4.005746ms

  # not ok
  `,
  { exitCode: 1 }
)

await spawner(
  function (test) {
    const t = test('assert after end')
    t.pass()
    t.end()
    t.pass()
  },
  `
  # assert after end
      ok 1 - passed
  ok 1 - assert after end # time = 0.629102ms
      ok 2 - passed
  not ok 2 - assertion after end (in assert after end)

  1..2
  # tests = 1/2 pass
  # asserts = 2/2 pass
  # time = 3.555015ms

  # not ok
  `,
  { exitCode: 1 }
)
