import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    test(
      'timeout option, classic, no plan',
      { timeout: 10 },
      async function (t) {
        await new Promise((resolve) => {
          setTimeout(resolve, 20)
        })
      }
    )
  },
  `
  TAP version 13

  # timeout option, classic, no plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  async function (test) {
    const t = test('timeout option, inverted, no plan', { timeout: 10 })
    await new Promise((resolve) => {
      setTimeout(resolve, 20)
    })
    t.end()
  },
  `
  TAP version 13

  # timeout option, inverted, no plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  function (test) {
    test('timeout option, classic, plan', { timeout: 10 }, async function (t) {
      t.plan(1)
      await new Promise((resolve) => {
        setTimeout(resolve, 20)
      })
    })
  },
  `
  TAP version 13

  # timeout option, classic, plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  async function (test) {
    const t = test('timeout option, inverted, plan', { timeout: 10 })
    t.plan(1)
    await new Promise((resolve) => {
      setTimeout(resolve, 20)
    })
    await t
  },
  `
  TAP version 13

  # timeout option, inverted, plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  function (test) {
    test('timeout method, classic, no plan', async function (t) {
      t.timeout(10)
      await new Promise((resolve) => {
        setTimeout(resolve, 20)
      })
    })
  },
  `
  TAP version 13

  # timeout method, classic, no plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  async function (test) {
    const t = test('timeout method, inverted, no plan')
    t.timeout(10)
    await new Promise((resolve) => {
      setTimeout(resolve, 20)
    })
    t.end()
  },
  `
  TAP version 13

  # timeout method, inverted, no plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  function (test) {
    test('timeout method, classic, plan', async function (t) {
      t.timeout(10)
      t.plan(1)
      await new Promise((resolve) => {
        setTimeout(resolve, 20)
      })
    })
  },
  `
  TAP version 13

  # timeout method, classic, plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)

await spawner(
  async function (test) {
    const t = test('timeout method, inverted, plan')
    t.timeout(10)
    t.plan(1)
    await new Promise((resolve) => {
      setTimeout(resolve, 20)
    })
    await t
  },
  `
  TAP version 13

  # timeout method, inverted, plan
  `,
  { exitCode: 1, stderr: { includes: 'Test timed out after 10 ms' } }
)
