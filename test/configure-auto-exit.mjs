import { spawner } from './helpers/index.js'

await spawner(
  function ({ configure, test }) {
    configure({ autoExit: true })

    test('auto exit prints the summary', function (t) {
      t.pass('prints here')
    })

    setTimeout(function () {
      if (global.Bare) global.Bare.exit()
      else process.exit()
    }, 1000)
  },
  `
  TAP version 13

  # auto exit prints the summary
      ok 1 - prints here
  ok 1 - auto exit prints the summary # time = 0.295115ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 18.422843ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
