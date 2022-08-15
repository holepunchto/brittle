import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test('never resolve', { timeout: 100 }, async function (t) {
      await new Promise((resolve) => {})
    })
  },
  `
  TAP version 13

  # never resolve
  `,
  { exitCode: 1, stderr: { includes: 'Test did not end' } }
)
