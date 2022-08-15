import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test('one', async function (t) {
      await new Promise(resolve => { setTimeout(resolve, 400) })
      t.pass()
    })

    test('two', async function (t) {
      await new Promise(resolve => { setTimeout(resolve, 200) })
      t.pass()
    })
  },
  `
  TAP version 13

  # one
      ok 1 - passed
  ok 1 - one # time = 403.910346ms

  # two
      ok 1 - passed
  ok 2 - two # time = 200.537827ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 609.22215ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
