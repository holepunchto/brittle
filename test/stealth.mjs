import { spawner, tester } from './helpers/index.js'

await spawner(
  function ({ stealth, test }) {
    stealth('top-level stealth', function (t) {
      t.pass('should not print')
    })

    test('top-level non-stealth', function (t) {
      t.pass('should print')
    })

    stealth('another top-level stealth', function (t) {
      t.pass('should not print')
    })

    stealth('redundant stealth option is ignored', { stealth: false }, function (t) {
      t.pass('should not print')
    })
  },
  `
  TAP version 13

  # top-level stealth
  ok 1 - top-level stealth # time = 0.209724ms

  # top-level non-stealth
      ok 1 - should print
  ok 2 - top-level non-stealth # time = 0.086718ms

  # another top-level stealth
  ok 3 - another top-level stealth # time = 0.02353ms

  # redundant stealth option is ignored
  ok 4 - redundant stealth option is ignored # time = 0.013899ms

  1..4
  # tests = 4/4 pass
  # asserts = 4/4 pass
  # time = 3.358469ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ stealth, test }) {
    stealth('top-level stealth fails', function (t) {
      t.fail('stealth here but fails so it prints')
    })

    test('top-level non-stealth', function (t) {
      t.pass('should print')
    })

    stealth('another top-level stealth', function (t) {
      t.pass('should not print')
    })
  },
  `
  TAP version 13

  # top-level stealth fails
      not ok 1 - stealth here but fails so it prints
        ---
        operator: fail
        stack: |
          [eval]:5:9
          Test._run (./index.js:593:13)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - top-level stealth fails # time = 2.513549ms

  # top-level non-stealth
      ok 1 - should print
  ok 2 - top-level non-stealth # time = 0.205535ms

  # another top-level stealth
  ok 3 - another top-level stealth # time = 0.02893ms

  1..3
  # tests = 2/3 pass
  # asserts = 2/3 pass
  # time = 6.324247ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function ({ stealth, test, configure }) {
    configure({ unstealth: true })

    stealth('another top-level stealth', function (t) {
      t.pass('should print due to unstealth')

      t.test('child', function (t) {
        t.plan(2)
        t.is(1, 1, 'should also print due to unstealth')
        t.pass('should also print due to unstealth')
      })
    })
  },
  `
  TAP version 13

  # another top-level stealth
      ok 1 - should print due to unstealth
      ok 2 - (child) - should also print due to unstealth
      ok 3 - (child) - should also print due to unstealth
  ok 1 - another top-level stealth # time = 0.358672ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 2.999305ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ stealth }) {
    stealth('nested stealth inheritance', function (t) {
      t.test('child', function (t) {
        t.plan(2)
        t.is(1, 1, '1 is 1')
        t.pass()
      })
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

await spawner(
  function ({ stealth }) {
    stealth('nested stealth double inheritance', function (t) {
      t.test('child1', function (t) {
        t.pass('in child1')
        t.test('child2', function (t) {
          t.plan(2)
          t.is(1, 1, '1 is 1')
          t.pass('in child2')
        })
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
      t.plan(2)
      t.is(1, 1, 'this is stealth')
      t.pass('this is stealth')
    })
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth test child
      ok 1 - not stealth before
      ok 4 - not stealth after
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
      t.plan(2)
      t.is(1, 1, 'this is stealth')
      t.pass('this is stealth')
    })
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth method
      ok 1 - not stealth before
      ok 4 - not stealth after
  ok 1 - stealth method # time = 0.422483ms

  1..1
  # tests = 1/1 pass
  # asserts = 4/4 pass
  # time = 3.48198ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('inverted stealth method',
  function (t) {
    t.plan(3)
    t.pass('not stealth before')

    const child = t.stealth('child')
    child.plan(2)
    child.is(1, 1, 'this is stealth')
    child.pass('this is stealth')

    t.pass('not stealth after')
  },
  `
  TAP version 13

  # inverted stealth method
      ok 1 - not stealth before
      ok 4 - not stealth after
  ok 1 - inverted stealth method # time = 0.393974ms

  1..1
  # tests = 1/1 pass
  # asserts = 4/4 pass
  # time = 3.373933ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('stealth test execution',
  async function (t) {
    t.plan(4)
    t.pass('not stealth before')
    await t.execution(() => t.test('child', { stealth: true }, async t => {
      t.plan(2)
      t.is(1, 1, 'this is stealth')
      t.pass('this is stealth')
    }), 'execution resolves')
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth test execution
      ok 1 - not stealth before
      ok 4 - execution resolves
      ok 5 - not stealth after
  ok 1 - stealth test execution # time = 0.521082ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 3.46745ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('stealth test with error',
  async function (t) {
    t.plan(3)
    t.pass('not stealth before')
    t.test('child', { stealth: true }, async t => {
      t.plan(2)
      t.is(1, 1, 'this is stealth')
      t.fail('this is stealth but fails so it is not')
    })
    t.pass('not stealth after')
  },
  `
  TAP version 13

  # stealth test with error
      ok 1 - not stealth before
      not ok 3 - (child) - this is stealth but fails so it is not
        ---
        operator: fail
        stack: |
          [eval]:9:9
          Test._run (./index.js:595:13)
          Test._test (./index.js:581:19)
          _fn ([eval]:6:7)
          Test._run (./index.js:595:13)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
      ok 4 - not stealth after
  not ok 1 - stealth test with error # time = 2.747684ms

  1..1
  # tests = 0/1 pass
  # asserts = 3/4 pass
  # time = 6.010867ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function ({ stealth, test }) {
    stealth('top-level stealth bails on first failure', function (t) {
      t.fail('stealth here but fails so it prints')
      t.pass('should not reach this')
      t.fail('this fail should not print')
    })

    test('nested stealth bails on first failure', function (t) {
      t.pass('prints here')
      t.stealth('child', function (t) {
        t.fail('stealth here but fails so it prints')
        t.pass('should not reach this')
        t.fail('this fail should not print')
      })
      t.pass('also prints here')
    })

    stealth('another top-level stealth', function (t) {
      t.pass('should not print')
    })
  },
  `
  TAP version 13

  # top-level stealth bails on first failure
      not ok 1 - stealth here but fails so it prints
        ---
        operator: fail
        stack: |
          [eval]:5:9
          Test._run (./index.js:595:13)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
  not ok 1 - top-level stealth bails on first failure # time = 2.567648ms

  # nested stealth bails on first failure
      ok 1 - prints here
      not ok 2 - (child) - stealth here but fails so it prints
        ---
        operator: fail
        stack: |
          [eval]:13:11
          Test._run (./index.js:595:13)
          Test._test (./index.js:581:19)
          Test._stealth (./index.js:540:17)
          Test._stealth (./index.js:538:49)
          [eval]:12:9
          Test._run (./index.js:595:13)
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        ...
      ok 3 - also prints here
  not ok 2 - nested stealth bails on first failure # time = 0.600648ms

  # another top-level stealth
  ok 3 - another top-level stealth # time = 0.030269ms

  1..3
  # tests = 1/3 pass
  # asserts = 3/5 pass
  # time = 6.686187ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
