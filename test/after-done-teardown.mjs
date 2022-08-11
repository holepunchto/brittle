import { tester, spawner } from './helpers/index.js'

await tester('teardown after end',
  function (t) {
    t.pass()
    t.end()
    setImmediate(() => {
      t.teardown(() => {})
    })
  },
  {
    stderr: { includes: 'Can\'t add teardown after end' },
    exitCode: 1
  }
)

await spawner(
  function (test) {
    const t = test('teardown after end')
    t.pass()
    t.end()
    setImmediate(() => {
      t.teardown(() => {})
    })
  },
  {
    stderr: { includes: 'Can\'t add teardown after end' },
    exitCode: 1
  }
)
