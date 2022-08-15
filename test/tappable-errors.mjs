import { tester, spawner } from './helpers/index.js'

await spawner(
  function (test) {
    function f () {
      function x () {
        throw Error('check')
      }
      x()
    }

    test('generic', function (t) {
      t.pass()
      f()
    })
  },
  `
  TAP version 13

  # generic
      ok 1 - passed
  `,
  { exitCode: 1, stderr: { includes: 'Error: check' } }
)

await tester('premature end',
  function (t) {
    t.plan(2)
    t.pass()
    t.end()
  },
  `
  TAP version 13

  # premature end
      ok 1 - passed
  `,
  { exitCode: 1, stderr: { includes: 'Too few assertions [assertion count (1) did not reach plan (2)]' } }
)

await tester('count exceeds plan',
  function (t) {
    t.plan(1)
    t.pass()
    t.pass()
  },
  `
  TAP version 13

  # count exceeds plan
      ok 1 - passed
      ok 2 - passed
  `,
  { exitCode: 1, stderr: { includes: 'Too many assertions' } }
)

await tester('premature end',
  async function (t) {
    const child = t.test('inverted child of premature end')
    child.plan(2)
    child.pass()
    await child
    console.log('this line should not be reached')
  },
  `
  TAP version 13

  # premature end
      ok 1 - (inverted child of premature end) - passed
  `,
  { exitCode: 1, stderr: { includes: 'Test did not end' } }
)

await tester('count exceeds plan',
  async function (t) {
    const child = t.test('inverted child of count exceeds plan')
    child.plan(1)
    child.pass()
    child.pass()
    await child
  },
  `
  TAP version 13

  # count exceeds plan
      ok 1 - (inverted child of count exceeds plan) - passed
      ok 2 - (inverted child of count exceeds plan) - passed
  `,
  { exitCode: 1, stderr: { includes: 'Assertion after end' } }
)

await spawner(
  async function (test) {
    const t = test('top level inverted')
    t.plan(2)
    t.pass()
    await t
    console.log('this log should never output')
  },
  `
  TAP version 13

  # top level inverted
      ok 1 - passed
  `,
  { exitCode: 1, stderr: { includes: 'Test did not end [assertion count (1) did not reach plan (2)]' } }
)

await spawner(
  function (test) {
    test('basic', function (t) {
      const child = test('child by using global object')
      child.pass()
      child.end()
    })
  },
  `
  TAP version 13

  # basic
  `,
  { exitCode: 1, stderr: { includes: 'Only run test can be running at the same time' } }
)