import { tester, spawner } from './helpers/index.js'

await tester(
  'classic plan must be positive',
  function (t) {
    t.plan(-1)
    t.pass()
  },
  `
  TAP version 13

  # classic plan must be positive
  `,
  {
    exitCode: 1,
    stderr: { includes: 'Plan takes a positive whole number only' }
  }
)

await spawner(
  function (test) {
    const t = test('inverted plan must be positive')
    t.plan(-1)
    t.pass()
    t.end()
  },
  `
  TAP version 13

  # inverted plan must be positive
  `,
  {
    exitCode: 1,
    stderr: { includes: 'Plan takes a positive whole number only' }
  }
)
