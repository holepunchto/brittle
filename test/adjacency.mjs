import { tester } from './helpers/index.js'

await tester('trailing adjacent awaits',
  async function (t) {
    const big = t.test('big test A')
    const little = t.test('little test A')

    big.plan(2)
    little.plan(1)

    little.pass('little passed')
    big.pass('big passed')

    big.pass('big pass again')

    await little
    await big
  },
  `
  TAP version 13

  # trailing adjacent awaits
      ok 1 - (little test A) - little passed
      ok 2 - (big test A) - big passed
      ok 3 - (big test A) - big pass again
  ok 1 - trailing adjacent awaits # time = 0.79643ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.66154ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('interruptive adjacent awaits',
  async function (t) {
    const big = t.test('big test B')
    const little = t.test('little test B')

    big.plan(2)
    little.plan(1)

    little.pass('little passed')
    big.pass('big passed')

    await little

    big.pass('big pass again')

    await big
  },
  `
  TAP version 13

  # interruptive adjacent awaits
      ok 1 - (little test B) - little passed
      ok 2 - (big test B) - big passed
      ok 3 - (big test B) - big pass again
  ok 1 - interruptive adjacent awaits # time = 0.775436ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.712776ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('deadlocking adjacent awaits',
  async function (t) {
    const big = t.test('big test C')
    const little = t.test('little test C')

    big.plan(2)
    little.plan(1)

    little.pass('little passed')
    big.pass('big passed')

    await big

    big.pass('big pass again')

    await little
  },
  `
  TAP version 13

  # deadlocking adjacent awaits
      ok 1 - (little test C) - little passed
      ok 2 - (big test C) - big passed
  `,
  { exitCode: 1, stderr: { includes: 'Test did not end' } }
)
