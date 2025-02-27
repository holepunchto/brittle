import { tester } from './helpers/index.js'

await tester('classic plan',
  function (t) {
    t.isStealth = true
    t.plan(2, 'comment')
    t.is(1, 1, '1 is 1')
    t.isStealth = false
    t.pass()
  },
  `
  TAP version 13

  # classic plan
    ok 2 - passed
  ok 1 - classic plan # time = 0.615191ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.550167ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('nested stealth inheritance',
  function (t) {
    t.isStealth = true
    t.test('child', function (t) {
      t.plan(2, 'comment')
      t.is(1, 1, '1 is 1')
      t.pass()
    })
  },
  `
  TAP version 13

  # nested stealth inheritance
  ok 1 - nested stealth inheritance # time = 0.306505ms


  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 0.919484ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('nested stealth double inheritance',
  function (t) {
    t.isStealth = true
    t.test('child1', function (t) {
      t.pass('in child1')
      t.test('child2', function (t) {
        t.plan(2, 'comment')
        t.is(1, 1, '1 is 1')
        t.pass('in child2')
      })
    })
  },
  `
  TAP version 13

  # nested stealth double inheritance
  ok 1 - nested stealth double inheritance # time = 0.306505ms


  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 0.919484ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('stealth test child',
  function (t) {
    t.plan(3)
    t.pass('not stealth before')
    t.test('child', { stealth: true }, function (t) {
      t.plan(3)
      t.is(1, 1, 'this is stealth')
      t.isStealth = false
      t.pass('this is not stealth')
      t.isStealth = true
      t.pass('this is stealth')
    })
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth test child
      ok 1 - not stealth before
      ok 3 - (child) - this is not stealth
      ok 5 - not stealth after
  ok 1 - stealth test child # time = 0.328614ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 0.895243ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('stealth method',
  function (t) {
    t.plan(3)
    t.pass('not stealth before')
    t.stealth('child', function (t) {
      t.plan(3)
      t.is(1, 1, 'this is stealth')
      t.isStealth = false
      t.pass('this is not stealth')
      t.isStealth = true
      t.pass('this is stealth')
    })
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth method
      ok 1 - not stealth before
      ok 3 - (child) - this is not stealth
      ok 5 - not stealth after
  ok 1 - stealth method # time = 0.455762ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 3.609011ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('inverted stealth method',
  function (t) {
    t.plan(3)
    t.pass('not stealth before')

    const child = t.stealth('child')
    child.plan(3)
    child.is(1, 1, 'this is stealth')
    child.isStealth = false
    child.pass('this is not stealth')
    child.isStealth = true
    child.pass('this is stealth')

    t.pass('not stealth after')
  },
  `
  TAP version 13

  # inverted stealth method
      ok 1 - not stealth before
      ok 3 - (child) - this is not stealth
      ok 5 - not stealth after
  ok 1 - inverted stealth method # time = 0.423731ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 3.609011ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('stealth test execution',
  async function (t) {
    t.plan(4)
    t.pass('not stealth before')
    await t.execution(() => t.test('child', { stealth: true }, async t => {
      t.plan(3)
      t.is(1, 1, 'this is stealth')
      t.isStealth = false
      t.pass('this is not stealth')
      t.isStealth = true
      t.pass('this is stealth')
    }), 'execution resolves')
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth test execution
      ok 1 - not stealth before
      ok 3 - (child) - this is not stealth
      ok 5 - execution resolves
      ok 6 - not stealth after
  ok 1 - stealth test execution # time = 0.328614ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 0.895243ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('stealth test with error',
  async function (t) {
    t.plan(3)
    t.pass('not stealth before')
    t.test('child', { stealth: true }, async t => {
      t.plan(3)
      t.is(1, 1, 'this is stealth')
      t.isStealth = false
      t.pass('this is not stealth')
      t.isStealth = true
      t.fail('this is stealth but fails so it is not')
    })
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth test with error
      ok 1 - not stealth before
      ok 3 - (child) - this is not stealth
      not ok 4 - (child) - this is stealth but fails so it is not
        ---
        operator: fail
        stack: |
          [eval]:12:9
          Test._run (./index.js:593:13)
          Test._test (./index.js:579:19)
          _fn ([eval]:6:7)
          Test._run (./index.js:593:13)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
      ok 5 - not stealth after
  not ok 1 - stealth test with error # time = 2.761635ms

  1..1
  # tests = 0/1 pass
  # asserts = 4/5 pass
  # time = 6.115739ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
