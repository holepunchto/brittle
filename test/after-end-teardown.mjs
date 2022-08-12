import { tester, spawner } from './helpers/index.js'

await tester('classic teardown after end',
  function (t) {
    t.pass()
    t.end()
    setImmediate(() => {
      t.teardown(() => {})
    })
  },
  `
  TAP version 13

  # classic teardown after end
      ok 1 - passed
  ok 1 - classic teardown after end # time = 0.711746ms
  `,
  {
    stderr: { includes: 'Can\'t add teardown after end' },
    exitCode: 1
  }
)

await spawner(
  function (test) {
    const t = test('inverted teardown after end')
    t.pass()
    t.end()
    setImmediate(() => {
      t.teardown(() => {})
    })
  },
  `
  TAP version 13

  # inverted teardown after end
      ok 1 - passed
  ok 1 - inverted teardown after end # time = 0.629008ms
  `,
  {
    stderr: { includes: 'Can\'t add teardown after end' },
    exitCode: 1
  }
)
