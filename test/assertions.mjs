import { tester, spawner } from './helpers/index.js'

await tester('passing (default messages)',
  async function (t) {
    t.pass()
    t.ok(true)
    t.absent(false)
    t.is(1, 1)
    t.is.coercively('1', 1)
    t.not(1, 2)
    t.not.coercively(1, '2')
    t.alike({ a: 1 }, { a: 1 })
    t.alike.coercively({ a: 1 }, { a: '1' })
    t.unlike({ a: 1 }, { a: 2 })
    t.unlike.coercively({ a: 1 }, { a: '2' })
    await t.execution(Promise.resolve('y'))
    await t.execution(async () => 'y')
    t.execution(() => 'y')
    await t.exception(Promise.reject(Error('n')))
    await t.exception(async () => { throw Error('n') }, /n/)
    t.exception(() => { throw Error('n') })
  },
  `
  TAP version 13

  # passing (default messages)
      ok 1 - passed
      ok 2 - expected truthy value
      ok 3 - expected falsy value
      ok 4 - should be equal
      ok 5 - should be equal
      ok 6 - should not be equal
      ok 7 - should not be equal
      ok 8 - should deep equal
      ok 9 - should deep equal
      ok 10 - should not deep equal
      ok 11 - should not deep equal
      ok 12 - should resolve
      ok 13 - should resolve
      ok 14 - should return
      ok 15 - should reject
      ok 16 - should reject
      ok 17 - should throw
  ok 1 - passing (default messages) # time = 3.17259ms

  1..1
  # tests = 1/1 pass
  # asserts = 17/17 pass
  # time = 6.012091ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('passing (custom messages)',
  async function (t) {
    t.pass('peanut')
    t.ok(true, 'brittle')
    t.absent(false, 'is')
    t.is(1, 1, 'an')
    t.is.coercively('1', 1, 'often')
    t.not(1, 2, 'overlooked')
    t.not.coercively(1, '2', 'tasty')
    t.alike({ a: 1 }, { a: 1 }, 'treat')
    t.alike.coercively({ a: 1 }, { a: '1' }, 'you should')
    t.unlike({ a: 1 }, { a: 2 }, 'try it')
    t.unlike.coercively({ a: 1 }, { a: '2' }, 'sometime')
    await t.execution(Promise.resolve('y'), 'but')
    await t.execution(async () => 'y', 'not really')
    t.execution(() => 'y', 'personally')
    await t.exception(Promise.reject(Error('n')), 'I have not had it')
    await t.exception(async () => { throw Error('n') }, 'in a long', /n/)
    t.exception(() => { throw Error('n') }, /n/, 'long time')
  },
  `
  TAP version 13

  # passing (custom messages)
      ok 1 - peanut
      ok 2 - brittle
      ok 3 - is
      ok 4 - an
      ok 5 - often
      ok 6 - overlooked
      ok 7 - tasty
      ok 8 - treat
      ok 9 - you should
      ok 10 - try it
      ok 11 - sometime
      ok 12 - but
      ok 13 - not really
      ok 14 - personally
      ok 15 - I have not had it
      ok 16 - in a long
      ok 17 - long time
  ok 1 - passing (custom messages) # time = 3.140034ms

  1..1
  # tests = 1/1 pass
  # asserts = 17/17 pass
  # time = 5.976933ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('failing (default messages)',
  async function (t) {
    t.fail()
    t.ok(false)
    t.absent(true)
    t.is(1, 2)
    t.is.coercively('2', 1)
    t.not(1, 1)
    t.not.coercively(1, '1')
    t.alike({ a: 1 }, { a: 2 })
    t.alike.coercively({ a: 1 }, { a: '2' })
    t.unlike({ a: 2 }, { a: 2 })
    t.unlike.coercively({ a: 2 }, { a: '2' })
    await t.execution(Promise.reject(Error('n')))
    await t.execution(async () => { throw Error('n') })
    t.execution(() => { throw Error('n') })
    await t.exception(Promise.resolve('y'))
    await t.exception(Promise.reject(Error('n')), /y/) // + before it was okay with 'n' and now it must be Error('n'), why? (Expected the Promise rejection reason to be an Error. (prefer-promise-reject-errors))
    await t.exception(async () => 'y')
    t.exception(() => 'y')
  },
  `
  TAP version 13

  # failing (default messages)
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          _fn ([eval]:4:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 2 - expected truthy value
        ---
        operator: ok
        stack: |
          _fn ([eval]:5:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 3 - expected falsy value
        ---
        operator: absent
        stack: |
          _fn ([eval]:6:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 4 - should be equal
        ---
        actual: 1
        expected: 2
        operator: is
        stack: |
          _fn ([eval]:7:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 5 - should be equal
        ---
        actual: 2
        expected: 1
        operator: is
        stack: |
          _fn ([eval]:8:10)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 6 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:9:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 7 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:10:11)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 8 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:11:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 9 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:12:13)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 10 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:13:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 11 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:14:14)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 12 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:15:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 13 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:16:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 14 - should return
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          _fn ([eval]:17:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 15 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:18:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 16 - should reject
        ---
        actual: 
        expected: 
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:19:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 17 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:20:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 18 - should throw
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          _fn ([eval]:21:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async Test._run (./index.js:555:7)
        ...
  not ok 1 - failing (default messages) # time = 10.34778ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/18 pass
  # time = 13.21987ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)

await tester('failing (custom messages)',
  async function (t) {
    t.fail('peanut')
    t.ok(false, 'brittle')
    t.absent(true, 'is')
    t.is(1, 2, 'an')
    t.is.coercively('2', 1, 'often')
    t.not(1, 1, 'overlooked')
    t.not.coercively(1, '1', 'tasty')
    t.alike({ a: 1 }, { a: 2 }, 'treat')
    t.alike.coercively({ a: 1 }, { a: '2' }, 'you should')
    t.unlike({ a: 2 }, { a: 2 }, 'try it')
    t.unlike.coercively({ a: 2 }, { a: '2' }, 'sometime')
    await t.execution(Promise.reject(Error('n')), 'but')
    await t.execution(async () => { throw Error('n') }, 'not really')
    t.execution(() => { throw Error('n') }, 'personally')
    await t.exception(Promise.resolve('y'), 'I have not had it')
    await t.exception(async () => 'y', 'in a long')
    t.exception(() => 'y', 'long time')
  },
  `
  TAP version 13

  # failing (custom messages)
      not ok 1 - peanut
        ---
        operator: fail
        stack: |
          _fn ([eval]:4:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 2 - brittle
        ---
        operator: ok
        stack: |
          _fn ([eval]:5:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 3 - is
        ---
        operator: absent
        stack: |
          _fn ([eval]:6:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 4 - an
        ---
        actual: 1
        expected: 2
        operator: is
        stack: |
          _fn ([eval]:7:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 5 - often
        ---
        actual: 2
        expected: 1
        operator: is
        stack: |
          _fn ([eval]:8:10)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 6 - overlooked
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:9:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 7 - tasty
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:10:11)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 8 - treat
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:11:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 9 - you should
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:12:13)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 10 - try it
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:13:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 11 - sometime
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:14:14)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 12 - but
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:15:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 13 - not really
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:16:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 14 - personally
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          _fn ([eval]:17:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 15 - I have not had it
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:18:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 16 - in a long
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:19:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 17 - long time
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          _fn ([eval]:20:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async Test._run (./index.js:555:7)
        ...
  not ok 1 - failing (custom messages) # time = 10.129451ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/17 pass
  # time = 13.079485ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)

await tester('passing and failing mixed',
  async function (t) {
    t.fail()
    t.pass()
    t.ok(false)
    t.ok(true)
    t.absent(true)
    t.absent(false)
    t.is(1, 2)
    t.is(1, 1)
    t.is.coercively('2', 1)
    t.is.coercively('1', 1)
    t.not(1, 1)
    t.not(1, 2)
    t.not.coercively(1, '1')
    t.not.coercively(1, '2')
    t.alike({ a: 1 }, { a: 2 })
    t.alike({ a: 1 }, { a: 1 })
    t.alike.coercively({ a: 1 }, { a: '2' })
    t.alike.coercively({ a: 1 }, { a: '1' })
    t.unlike({ a: 2 }, { a: 2 })
    t.unlike({ a: 1 }, { a: 2 })
    t.unlike.coercively({ a: 2 }, { a: '2' })
    t.unlike.coercively({ a: 1 }, { a: '2' })
    await t.execution(Promise.resolve('y'))
    await t.execution(Promise.reject(Error('n')))
    await t.execution(async () => 'y')
    await t.execution(async () => { throw Error('n') })
    t.execution(() => 'y')
    t.execution(() => { throw Error('n') })
    await t.exception(Promise.resolve('y'))
    await t.exception(Promise.reject(Error('n')))
    await t.exception(async () => 'y')
    await t.exception(async () => { throw Error('n') })
    t.exception(() => 'y')
    t.exception(() => { throw Error('n') })
  },
  `
  TAP version 13

  # passing and failing mixed
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          _fn ([eval]:4:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 2 - passed
      not ok 3 - expected truthy value
        ---
        operator: ok
        stack: |
          _fn ([eval]:6:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 4 - expected truthy value
      not ok 5 - expected falsy value
        ---
        operator: absent
        stack: |
          _fn ([eval]:8:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 6 - expected falsy value
      not ok 7 - should be equal
        ---
        actual: 1
        expected: 2
        operator: is
        stack: |
          _fn ([eval]:10:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 8 - should be equal
      not ok 9 - should be equal
        ---
        actual: 2
        expected: 1
        operator: is
        stack: |
          _fn ([eval]:12:10)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 10 - should be equal
      not ok 11 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:14:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 12 - should not be equal
      not ok 13 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:16:11)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 14 - should not be equal
      not ok 15 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:18:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 16 - should deep equal
      not ok 17 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:20:13)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 18 - should deep equal
      not ok 19 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:22:7)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 20 - should not deep equal
      not ok 21 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:24:14)
          Test._run (./index.js:555:13)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 22 - should not deep equal
      ok 23 - should resolve
      not ok 24 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:27:5)
          async Test._run (./index.js:555:7)
        ...
      ok 25 - should resolve
      not ok 26 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:29:5)
          async Test._run (./index.js:555:7)
        ...
      ok 27 - should return
      not ok 28 - should return
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          _fn ([eval]:31:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async Test._run (./index.js:555:7)
        ...
      not ok 29 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:32:5)
          async Test._run (./index.js:555:7)
        ...
      ok 30 - should reject
      not ok 31 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:34:5)
          async Test._run (./index.js:555:7)
        ...
      ok 32 - should reject
      not ok 33 - should throw
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          _fn ([eval]:36:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async Test._run (./index.js:555:7)
        ...
      ok 34 - should throw
  not ok 1 - passing and failing mixed # time = 10.946447ms

  1..1
  # tests = 0/1 pass
  # asserts = 17/34 pass
  # time = 13.857638ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)

await spawner(
  async function (test) {
    const t = test('inverted passing (default messages)')
    t.pass()
    t.ok(true)
    t.absent(false)
    t.is(1, 1)
    t.is.coercively('1', 1)
    t.not(1, 2)
    t.not.coercively(1, '2')
    t.alike({ a: 1 }, { a: 1 })
    t.alike.coercively({ a: 1 }, { a: '1' })
    t.unlike({ a: 1 }, { a: 2 })
    t.unlike.coercively({ a: 1 }, { a: '2' })
    await t.execution(Promise.resolve('y'))
    await t.execution(async () => 'y')
    t.execution(() => 'y')
    await t.exception(Promise.reject(Error('n')))
    await t.exception(async () => { throw Error('n') }, /n/)
    t.exception(() => { throw Error('n') })
    t.end()
  },
  `
  TAP version 13

  # inverted passing (default messages)
      ok 1 - passed
      ok 2 - expected truthy value
      ok 3 - expected falsy value
      ok 4 - should be equal
      ok 5 - should be equal
      ok 6 - should not be equal
      ok 7 - should not be equal
      ok 8 - should deep equal
      ok 9 - should deep equal
      ok 10 - should not deep equal
      ok 11 - should not deep equal
      ok 12 - should resolve
      ok 13 - should resolve
      ok 14 - should return
      ok 15 - should reject
      ok 16 - should reject
      ok 17 - should throw
  ok 1 - inverted passing (default messages) # time = 2.009916ms

  1..1
  # tests = 5/5 pass
  # asserts = 17/17 pass
  # time = 5.973149ms

  # not ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test('inverted passing (custom messages)')
    t.pass('peanut')
    t.ok(true, 'brittle')
    t.absent(false, 'is')
    t.is(1, 1, 'an')
    t.is.coercively('1', 1, 'often')
    t.not(1, 2, 'overlooked')
    t.not.coercively(1, '2', 'tasty')
    t.alike({ a: 1 }, { a: 1 }, 'treat')
    t.alike.coercively({ a: 1 }, { a: '1' }, 'you should')
    t.unlike({ a: 1 }, { a: 2 }, 'try it')
    t.unlike.coercively({ a: 1 }, { a: '2' }, 'sometime')
    await t.execution(Promise.resolve('y'), 'but')
    await t.execution(async () => 'y', 'not really')
    t.execution(() => 'y', 'personally')
    await t.exception(Promise.reject(Error('n')), 'I have not had it')
    await t.exception(async () => { throw Error('n') }, 'in a long', /n/)
    t.exception(() => { throw Error('n') }, /n/, 'long time')
    t.end()
  },
  `
  TAP version 13

  # inverted passing (custom messages)
      ok 1 - peanut
      ok 2 - brittle
      ok 3 - is
      ok 4 - an
      ok 5 - often
      ok 6 - overlooked
      ok 7 - tasty
      ok 8 - treat
      ok 9 - you should
      ok 10 - try it
      ok 11 - sometime
      ok 12 - but
      ok 13 - not really
      ok 14 - personally
      ok 15 - I have not had it
      ok 16 - in a long
      ok 17 - long time
  ok 1 - inverted passing (custom messages) # time = 3.831434ms

  1..1
  # tests = 1/1 pass
  # asserts = 17/17 pass
  # time = 6.015545ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test('inverted failing (default messages)')
    t.fail()
    t.ok(false)
    t.absent(true)
    t.is(1, 2)
    t.is.coercively('2', 1)
    t.not(1, 1)
    t.not.coercively(1, '1')
    t.alike({ a: 1 }, { a: 2 })
    t.alike.coercively({ a: 1 }, { a: '2' })
    t.unlike({ a: 2 }, { a: 2 })
    t.unlike.coercively({ a: 2 }, { a: '2' })
    await t.execution(Promise.reject(Error('n')))
    await t.execution(async () => { throw Error('n') })
    t.execution(() => { throw Error('n') })
    await t.exception(Promise.resolve('y'))
    await t.exception(Promise.reject(Error('n')), /y/)
    await t.exception(async () => 'y')
    t.exception(() => 'y')
    t.end()
  },
  `
  TAP version 13

  # inverted failing (default messages)
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          _fn ([eval]:5:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 2 - expected truthy value
        ---
        operator: ok
        stack: |
          _fn ([eval]:6:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 3 - expected falsy value
        ---
        operator: absent
        stack: |
          _fn ([eval]:7:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 4 - should be equal
        ---
        actual: 1
        expected: 2
        operator: is
        stack: |
          _fn ([eval]:8:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 5 - should be equal
        ---
        actual: 2
        expected: 1
        operator: is
        stack: |
          _fn ([eval]:9:10)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 6 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:10:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 7 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:11:11)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 8 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:12:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 9 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:13:13)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 10 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:14:7)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 11 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:15:14)
          [eval]:26:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 12 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:16:5)
        ...
      not ok 13 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:17:5)
        ...
      not ok 14 - should return
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          _fn ([eval]:18:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 15 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:19:5)
        ...
      not ok 16 - should reject
        ---
        actual: 
        expected: 
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:20:5)
        ...
      not ok 17 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:21:5)
        ...
      not ok 18 - should throw
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          _fn ([eval]:22:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 1 - inverted failing (default messages) # time = 11.076319ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/18 pass
  # time = 13.147535ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)

await spawner(
  async function (test) {
    const t = test('inverted failing (custom messages)')
    t.fail('peanut')
    t.ok(false, 'brittle')
    t.absent(true, 'is')
    t.is(1, 2, 'an')
    t.is.coercively('2', 1, 'often')
    t.not(1, 1, 'overlooked')
    t.not.coercively(1, '1', 'tasty')
    t.alike({ a: 1 }, { a: 2 }, 'treat')
    t.alike.coercively({ a: 1 }, { a: '2' }, 'you should')
    t.unlike({ a: 2 }, { a: 2 }, 'try it')
    t.unlike.coercively({ a: 2 }, { a: '2' }, 'sometime')
    await t.execution(Promise.reject(Error('n')), 'but')
    await t.execution(async () => { throw Error('n') }, 'not really')
    t.execution(() => { throw Error('n') }, 'personally')
    await t.exception(Promise.resolve('y'), 'I have not had it')
    await t.exception(async () => 'y', 'in a long')
    t.exception(() => 'y', 'long time')
    t.end()
  },
  `
  TAP version 13

  # inverted failing (custom messages)
      not ok 1 - peanut
        ---
        operator: fail
        stack: |
          _fn ([eval]:5:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 2 - brittle
        ---
        operator: ok
        stack: |
          _fn ([eval]:6:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 3 - is
        ---
        operator: absent
        stack: |
          _fn ([eval]:7:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 4 - an
        ---
        actual: 1
        expected: 2
        operator: is
        stack: |
          _fn ([eval]:8:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 5 - often
        ---
        actual: 2
        expected: 1
        operator: is
        stack: |
          _fn ([eval]:9:10)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 6 - overlooked
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:10:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 7 - tasty
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:11:11)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 8 - treat
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:12:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 9 - you should
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:13:13)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 10 - try it
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:14:7)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 11 - sometime
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:15:14)
          [eval]:25:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      not ok 12 - but
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:16:5)
        ...
      not ok 13 - not really
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:17:5)
        ...
      not ok 14 - personally
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          _fn ([eval]:18:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 15 - I have not had it
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:19:5)
        ...
      not ok 16 - in a long
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:20:5)
        ...
      not ok 17 - long time
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          _fn ([eval]:21:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
  not ok 1 - inverted failing (custom messages) # time = 10.618919ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/17 pass
  # time = 12.751059ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)

await spawner(
  async function (test) {
    const t = test('inverted passing and failing mixed')
    t.fail()
    t.pass()
    t.ok(false)
    t.ok(true)
    t.absent(true)
    t.absent(false)
    t.is(1, 2)
    t.is(1, 1)
    t.is.coercively('2', 1)
    t.is.coercively('1', 1)
    t.not(1, 1)
    t.not(1, 2)
    t.not.coercively(1, '1')
    t.not.coercively(1, '2')
    t.alike({ a: 1 }, { a: 2 })
    t.alike({ a: 1 }, { a: 1 })
    t.alike.coercively({ a: 1 }, { a: '2' })
    t.alike.coercively({ a: 1 }, { a: '1' })
    t.unlike({ a: 2 }, { a: 2 })
    t.unlike({ a: 1 }, { a: 2 })
    t.unlike.coercively({ a: 2 }, { a: '2' })
    t.unlike.coercively({ a: 1 }, { a: '2' })
    await t.execution(Promise.resolve('y'))
    await t.execution(Promise.reject(Error('n')))
    await t.execution(async () => 'y')
    await t.execution(async () => { throw Error('n') })
    t.execution(() => 'y')
    t.execution(() => { throw Error('n') })
    await t.exception(Promise.resolve('y'))
    await t.exception(Promise.reject(Error('n')))
    await t.exception(async () => 'y')
    await t.exception(async () => { throw Error('n') })
    t.exception(() => 'y')
    t.exception(() => { throw Error('n') })
    t.end()
  },
  `
  TAP version 13

  # inverted passing and failing mixed
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          _fn ([eval]:5:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 2 - passed
      not ok 3 - expected truthy value
        ---
        operator: ok
        stack: |
          _fn ([eval]:7:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 4 - expected truthy value
      not ok 5 - expected falsy value
        ---
        operator: absent
        stack: |
          _fn ([eval]:9:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 6 - expected falsy value
      not ok 7 - should be equal
        ---
        actual: 1
        expected: 2
        operator: is
        stack: |
          _fn ([eval]:11:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 8 - should be equal
      not ok 9 - should be equal
        ---
        actual: 2
        expected: 1
        operator: is
        stack: |
          _fn ([eval]:13:10)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 10 - should be equal
      not ok 11 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:15:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 12 - should not be equal
      not ok 13 - should not be equal
        ---
        actual: 1
        expected: 1
        operator: not
        stack: |
          _fn ([eval]:17:11)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 14 - should not be equal
      not ok 15 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:19:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 16 - should deep equal
      not ok 17 - should deep equal
        ---
        actual: 
          a: 1
        expected: 
          a: 2
        operator: alike
        stack: |
          _fn ([eval]:21:13)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 18 - should deep equal
      not ok 19 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:23:7)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 20 - should not deep equal
      not ok 21 - should not deep equal
        ---
        actual: 
          a: 2
        expected: 
          a: 2
        operator: unlike
        stack: |
          _fn ([eval]:25:14)
          [eval]:42:1
          Script.runInThisContext (node:vm:129:12)
          Object.runInThisContext (node:vm:305:38)
          node:internal/process/execution:76:19
          [eval]-wrapper:6:22
          evalScript (node:internal/process/execution:75:60)
          node:internal/main/eval_string:27:3
        ...
      ok 22 - should not deep equal
      ok 23 - should resolve
      not ok 24 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:28:5)
        ...
      ok 25 - should resolve
      not ok 26 - should resolve
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:30:5)
        ...
      ok 27 - should return
      not ok 28 - should return
        ---
        actual: 
        expected: null
        operator: execution
        stack: |
          _fn ([eval]:32:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      not ok 29 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:33:5)
        ...
      ok 30 - should reject
      not ok 31 - should reject
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          processTicksAndRejections (node:internal/process/task_queues:96:5)
          async _fn ([eval]:35:5)
        ...
      ok 32 - should reject
      not ok 33 - should throw
        ---
        actual: false
        expected: undefined
        operator: exception
        stack: |
          _fn ([eval]:37:7)
          processTicksAndRejections (node:internal/process/task_queues:96:5)
        ...
      ok 34 - should throw
  not ok 1 - inverted passing and failing mixed # time = 11.326632ms

  1..1
  # tests = 0/1 pass
  # asserts = 17/34 pass
  # time = 13.396443ms

  # not ok
  `,
  { exitCode: 1, stderr: '' },
  { bail: false }
)
