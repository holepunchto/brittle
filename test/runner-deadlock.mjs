import { tester, spawner } from './helpers/index.js'

await tester(
  'classic deadlock with plan',
  async function (t) {
    t.plan(1)
    t.pass()
    await t
  },
  `
  TAP version 13

  # classic deadlock with plan
      ok 1 - passed
  `,
  { exitCode: 1, stderr: { includes: 'Test appears deadlocked' } }
)

await tester(
  'classic deadlock without plan',
  async function (t) {
    t.pass()
    await t
  },
  `
  TAP version 13

  # classic deadlock without plan
      ok 1 - passed
  `,
  { exitCode: 1, stderr: { includes: 'Test did not end' } }
)

await tester(
  'classic bare deadlock',
  async function (t) {
    await t
  },
  `
  TAP version 13

  # classic bare deadlock
  `,
  { exitCode: 1, stderr: { includes: 'Test did not end' } }
)

await spawner(
  async function (test) {
    const t = test('try inverted deadlock')
    t.plan(1)
    t.pass()
    await t
  },
  `
  TAP version 13

  # try inverted deadlock
      ok 1 - passed
  ok 1 - try inverted deadlock # time = 0.614412ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.156145ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'try deadlock by child with plan',
  async function (t) {
    const child = t.test()
    child.plan(1)
    child.pass()
    await child
  },
  `
  TAP version 13

  # try deadlock by child with plan
      ok 1 - passed
  ok 1 - try deadlock by child with plan # time = 0.662356ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.517156ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'try deadlock by child without plan',
  async function (t) {
    const child = t.test()
    child.pass()
    child.end()
    await child
  },
  `
  TAP version 13

  # try deadlock by child without plan
      ok 1 - passed
  ok 1 - try deadlock by child without plan # time = 0.651919ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.51682ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
