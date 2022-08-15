import { tester } from './helpers/index.js'

await tester('exception crash when an error is native',
  async function (t) {
    t.exception(() => { throw ReferenceError('test') })
    t.exception(() => { throw SyntaxError('test') })
    t.exception(() => { throw RangeError('test') })
    t.exception(() => { throw EvalError('test') })
    t.exception(() => { throw TypeError('test') })
    await t.exception(async () => { throw ReferenceError('test') })
    await t.exception(async () => { throw SyntaxError('test') })
    await t.exception(async () => { throw RangeError('test') })
    await t.exception(async () => { throw EvalError('test') })
    await t.exception(async () => { throw TypeError('test') })
    await t.exception(Promise.reject(ReferenceError('test')))
    await t.exception(Promise.reject(SyntaxError('test')))
    await t.exception(Promise.reject(RangeError('test')))
    await t.exception(Promise.reject(EvalError('test')))
    await t.exception(Promise.reject(TypeError('test')))
  },
  `
  TAP version 13

  # exception crash when an error is native
  `,
  { exitCode: 1, stderr: { includes: 'ReferenceError: test' } }
)

await tester('exception.all does not crash when an error is native',
  async function (t) {
    t.exception.all(() => { throw ReferenceError('test') })
    t.exception.all(() => { throw SyntaxError('test') })
    t.exception.all(() => { throw RangeError('test') })
    t.exception.all(() => { throw EvalError('test') })
    t.exception.all(() => { throw TypeError('test') })
    await t.exception.all(async () => { throw ReferenceError('test') })
    await t.exception.all(async () => { throw SyntaxError('test') })
    await t.exception.all(async () => { throw RangeError('test') })
    await t.exception.all(async () => { throw EvalError('test') })
    await t.exception.all(async () => { throw TypeError('test') })
    await t.exception.all(Promise.reject(ReferenceError('test')))
    await t.exception.all(Promise.reject(SyntaxError('test')))
    await t.exception.all(Promise.reject(RangeError('test')))
    await t.exception.all(Promise.reject(EvalError('test')))
    await t.exception.all(Promise.reject(TypeError('test')))
  },
  `
  TAP version 13

  # exception.all does not crash when an error is native
      ok 1 - should throw
      ok 2 - should throw
      ok 3 - should throw
      ok 4 - should throw
      ok 5 - should throw
      ok 6 - should reject
      ok 7 - should reject
      ok 8 - should reject
      ok 9 - should reject
      ok 10 - should reject
      ok 11 - should reject
      ok 12 - should reject
      ok 13 - should reject
      ok 14 - should reject
      ok 15 - should reject
  ok 1 - exception.all does not crash when an error is native # time = 2.143232ms

  1..1
  # tests = 1/1 pass
  # asserts = 15/15 pass
  # time = 5.041342ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
