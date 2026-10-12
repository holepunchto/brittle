import { spawner } from './helpers/index.js'

await spawner(
  function ({ configure, test }) {
    configure({ autoExit: true })

    test('auto exit ends the run', function (t) {
      t.pass('prints here')
      t.pass('also prints here')
    })
  },
  `
  TAP version 13

  # auto exit ends the run
      ok 1 - prints here
      ok 2 - also prints here
  ok 1 - auto exit ends the run # time = 0.295115ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 18.422843ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
