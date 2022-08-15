import { tester, spawner } from './helpers/index.js'

await tester('classic plan must be integer',
  function (t) {
    t.plan('x')
    t.pass()
  },
  `
  TAP version 13

  # classic plan must be integer
  `,
  { exitCode: 1, stderr: { includes: 'Plan takes a positive whole number only' } }
)

await spawner(
  function (test) {
    const t = test('inverted plan must be integer')
    t.plan('x')
    t.pass()
    t.end()
  },
  `
  TAP version 13

  # inverted plan must be integer
  `,
  { exitCode: 1, stderr: { includes: 'Plan takes a positive whole number only' } }
)
