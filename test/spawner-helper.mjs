import { tester } from './helpers/index.js'

// check that it actually didn't catch stdout
const results1 = await tester('comment after end',
  function (t) {
    t.plan(1)
    t.is(1, 1)
    setImmediate(() => t.comment('test'))
  },
  `
  TAP vErSiOn 13

  # comment after end
      ok 1 - sHoUlD bE eQuAl
  ok 1 - comment after end # time = 0.716469ms
  `,
  {
    stderr: { includes: 'Can\'t comment after end' },
    exitCode: 1,
    _silent: true
  }
)

if (!findError(results1, 'TAP_MISMATCH') || findError(results1, 'STDERR_VALIDATION')) {
  console.error(results1.errors)
  throw new Error('There should only be a tap mismatch error')
}

// check that it actually didn't catch stderr
const results2 = await tester('comment after end',
  function (t) {
    t.plan(1)
    t.is(1, 1)
    setImmediate(() => t.comment('test'))
  },
  `
  TAP version 13

  # comment after end
      ok 1 - should be equal
  ok 1 - comment after end # time = 0.716469ms
  `,
  {
    stderr: { includes: '7h1s i$ th3 wr0ng m3ss4g3' },
    exitCode: 1,
    _silent: true
  }
)

if (!findError(results2, 'STDERR_VALIDATION') || findError(results2, 'TAP_MISMATCH')) {
  console.error(results2.errors)
  throw new Error('There should only be a stderr validation error')
}

// helpers
function findError (results, type) {
  return results.errors.find(err => err.type === type)
}
