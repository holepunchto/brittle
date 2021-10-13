import { expectType, expectError } from 'tsd'
import brittle, {
  Test,
  TestFn,
  Metadata,
  test,
  skip,
  todo,
  configure
} from '../index.js'

// Top-level exports

expectType<TestFn>(brittle)
expectType<typeof brittle.test>(test)
expectType<typeof brittle.skip>(skip)
expectType<typeof brittle.todo>(todo)
expectType<typeof brittle.configure>(configure)

// CommonJS compatibility

import * as brittleStar from '../index.js'
import brittleCjs = require('../index.js')

expectType<typeof brittle>(brittleStar.default)
expectType<typeof brittle>(brittleCjs.default)

// Test instances

test('types', async (t) => {
  expectType<Test>(t)
  expectType<Test>(t.assert)

  // Sub tests

  expectType<Test>(t.test('sub test'))
  expectType<Promise<Metadata>>(t.test('sub test with fn', () => {}))

  // Assertions

  t.is(1, 1)
  t.is(1, 1, 'comment')
  // @ts-expect-error
  t.is(1, '1')
  t.is.coercively(1, '1')
  expectType<boolean>(await t.is(1, 1))

  t.not(1, 1)
  t.not(1, 1, 'comment')
  // @ts-expect-error
  t.not(1, '1')
  t.not.coercively(1, '1')
  expectType<boolean>(await t.not(1, 1))

  t.alike(1, 1)
  t.alike(1, 1, 'comment')
  // @ts-expect-error
  t.alike(1, '1')
  t.alike.coercively(1, '1')
  expectType<boolean>(await t.alike(1, 1))

  t.unlike(1, 1)
  t.unlike(1, 1, 'comment')
  // @ts-expect-error
  t.unlike(1, '1')
  t.unlike.coercively(1, '1')
  expectType<boolean>(await t.unlike(1, 1))

  t.ok(true)
  t.ok(true, 'comment')
  t.ok(1)
  t.ok('hello')
  expectType<boolean>(await t.ok(true))

  t.absent(false)
  t.absent(false, 'comment')
  t.absent(0)
  t.absent('')
  expectType<boolean>(await t.absent(false))

  t.pass()
  t.pass('success')
  expectType<boolean>(await t.pass())

  t.fail()
  t.fail('failure')
  expectType<boolean>(await t.fail())

  t.exception(() => { throw Error('reject') })
  t.exception(() => { throw Error('reject') }, /reject/)
  t.exception(() => { throw Error('reject') }, 'comment')
  t.exception(() => { throw Error('reject') }, /reject/, 'comment')
  t.exception(async () => { throw Error('reject') })
  t.exception(Promise.reject(Error('reject')))
  expectType<boolean>(await t.exception(() => { throw Error('reject') }))

  t.execution(() => { })
  t.execution(() => { }, 'comment')
  t.execution(async () => { })
  t.execution(Promise.resolve('resolve'))
  expectType<boolean>(await t.execution(() => { }))

  t.snapshot({ foo: 'bar' })
  t.snapshot({ foo: 'bar' }, 'comment')
  expectType<boolean>(await t.snapshot({ foo: 'bar' }))
})
