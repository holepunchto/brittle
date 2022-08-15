import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test('tbd', { timeout: 10 }, async function (t) {
      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
      t.pass()
    })

    test('tbd2', { timeout: 10 }, function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # tbd
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)
