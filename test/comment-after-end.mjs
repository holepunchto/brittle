import { tester } from './helpers/index.js'

await tester('comment after end',
  function (t) {
    t.plan(1)
    t.is(1, 1)
    setImmediate(() => t.comment('test'))
  },
  {
    stderr: { includes: 'Can\'t comment after end' },
    exitCode: 1
  }
)
