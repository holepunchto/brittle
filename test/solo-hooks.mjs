import { spawner } from './helpers/index.js'

await spawner(
  function ({ hook, solo }) {
    const resource = { value: 0 }

    const unhook = hook('setup resource', function () { resource.value = 42 })

    const unhook2 = hook('setup resource unhooked', function () { resource.value = 24 })
    unhook2()

    solo('should not execute unhooked hooks', function (t) {
      t.is(resource.value, 42, 'should not have executed unhooked hook')
    })

    unhook()
  },
  `
  TAP version 13

  # setup resource
  ok 1 - setup resource # time = 0.216366ms

  # should not execute unhooked hooks
      ok 1 - should not have executed unhooked hook
  ok 2 - should not execute unhooked hooks # time = 0.613949ms

  1..2
  # tests = 2/2 pass
  # asserts = 1/1 pass
  # time = 3.695355ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ hook, solo }) {
    const state = { values: [] }

    const unhook = hook('setup', function () { state.values.push('first') })

    solo('should execute hooks and cleanup', function (t) {
      t.is(state.values[0], 'first', 'setup hook should execute')
      t.is(state.values.length, 1, 'only one hook should execute')
    })

    unhook('unhook cleanup', function () {
      console.log('unhook cleanup should execute')
    })

    const unhookUnused = hook('unused hook', function () { console.log('unused hook should not execute') })
    unhookUnused('unused hook teardown', function () { console.log('unused hook teardown should not execute') })
  },
  `
  TAP version 13

  # setup
  ok 1 - setup # time = 0.143737ms

  # should execute hooks and cleanup
      ok 1 - setup hook should execute
      ok 2 - only one hook should execute
  ok 2 - should execute hooks and cleanup # time = 0.223815ms

  # unhook cleanup
  unhook cleanup should execute
  ok 3 - unhook cleanup # time = 0.045269ms

  1..3
  # tests = 3/3 pass
  # asserts = 2/2 pass
  # time = 4.883305ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ hook, solo }) {
    const state = { hooks: [] }

    const unhook1 = hook('first hook', function () { state.hooks.push('first') })
    const unhook2 = hook('second hook', function () { state.hooks.push('second') })
    const unhook3 = hook('third hook', function () { state.hooks.push('third') })

    solo('should execute multiple hooks in order', function (t) {
      t.is(state.hooks.length, 3, 'all hooks should execute')
      t.is(state.hooks[0], 'first', 'first hook should execute first')
      t.is(state.hooks[1], 'second', 'second hook should execute second')
      t.is(state.hooks[2], 'third', 'third hook should execute third')
    })

    unhook1()
    unhook2()
    unhook3()
  },
  `
  TAP version 13

  # first hook
  ok 1 - first hook # time = 0.143737ms

  # second hook
  ok 2 - second hook # time = 0.088451ms

  # third hook
  ok 3 - third hook # time = 0.078932ms

  # should execute multiple hooks in order
      ok 1 - all hooks should execute
      ok 2 - first hook should execute first
      ok 3 - second hook should execute second
      ok 4 - third hook should execute third
  ok 4 - should execute multiple hooks in order # time = 0.256789ms

  1..4
  # tests = 4/4 pass
  # asserts = 4/4 pass
  # time = 5.123456ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ hook, solo }) {
    const state = { executed: [] }

    const unhook1 = hook('first hook to remove', function () { state.executed.push('removed') })
    const unhook2 = hook('second hook to keep', function () { state.executed.push('stayed') })

    unhook1() // Remove first hook before solo runs

    solo('should only execute remaining hooks after selective unhook', function (t) {
      t.is(state.executed.length, 1, 'only one hook should execute')
      t.is(state.executed[0], 'stayed', 'remaining hook should execute')
    })

    unhook2()
  },
  `
  TAP version 13

  # second hook to keep
  ok 1 - second hook to keep # time = 0.123456ms

  # should only execute remaining hooks after selective unhook
      ok 1 - only one hook should execute
      ok 2 - remaining hook should execute
  ok 2 - should only execute remaining hooks after selective unhook # time = 0.234567ms

  1..2
  # tests = 2/2 pass
  # asserts = 2/2 pass
  # time = 4.567890ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function ({ hook, test }) {
    const failingResult = await hook('setup hook that fails', function (t) {
      t.fail()
    })

    const unhook = hook('setup hook that passes', function (t) {
      t.pass()
    })

    const passingResult = await unhook

    test('should get hook result when awaited', function (t) {
      t.is(failingResult, false, 'should receive fail result from hook')
      t.is(passingResult, true, 'should receive pass result from hook')
    })

    unhook('cleanup after hook', function () {
      console.log('cleanup after hook should execute')
    })
  },
  `
  TAP version 13

  # setup hook that fails
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          [eval]:5:9
          process.processTicksAndRejections (node:internal/process/task_queues:105:5)
          async _fn ([eval]:4:27)
        ...
  not ok 1 - setup hook that fails # time = 2.842179ms

  # setup hook that passes
      ok 1 - passed
  ok 2 - setup hook that passes # time = 0.183506ms

  # should get hook result when awaited
      ok 1 - should receive fail result from hook
      ok 2 - should receive pass result from hook
  ok 3 - should get hook result when awaited # time = 0.109897ms

  # cleanup after hook
  cleanup after hook should execute
  ok 4 - cleanup after hook # time = 0.038179ms

  1..4
  # tests = 3/4 pass
  # asserts = 3/4 pass
  # time = 7.574679ms
  `,
  { exitCode: 1, stderr: '' }
)

await spawner(
  function ({ hook, solo }) {
    const unhook = hook('hook without function')

    solo('should run unhook without hook function', function (t) {
      t.pass()
    })

    unhook('unhook without hook function', function () {
      console.log('unhook without hook function should execute')
    })
  },
  `
  TAP version 13

  # should run unhook without hook function
      ok 1 - passed
  ok 1 - should run unhook without hook function # time = 0.234567ms

  # unhook without hook function
  unhook without hook function should execute
  ok 2 - unhook without hook function # time = 0.081258ms

  1..2
  # tests = 2/2 pass
  # asserts = 1/1 pass
  # time = 4.567890ms
  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, hook }) {
    const unhook = hook('first hook', function () {
      console.log('first hook should run')
    })

    test('should run hooks without solo', function (t) {
      t.pass()
    })

    unhook('unhook first hook', function () {
      console.log('unhook first hook should run')
    })
  },
  `
  TAP version 13
  
  # first hook
  first hook should run
  ok 1 - first hook # time = 0.123456ms
  
  # should run hooks without solo
      ok 1 - passed
  ok 2 - should run hooks without solo # time = 0.234567ms
  
  # unhook first hook
  unhook first hook should run
  ok 3 - unhook first hook # time = 0.345678ms
  
  1..3
  # tests = 2/2 pass
  # asserts = 1/1 pass
  # time = 5.678901ms
  # ok
  `,
  { exitCode: 0, stderr: '' }
)
