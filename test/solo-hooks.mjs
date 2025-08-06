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
  function ({ hook, solo }) {
    const state = { asyncValue: null }

    const unhook = hook('async hook', async function () {
      await new Promise(resolve => setTimeout(resolve, 10))
      state.asyncValue = 'async-complete'
    })

    solo('should wait for async hooks to complete before execution', function (t) {
      t.is(state.asyncValue, 'async-complete', 'async hook should complete before solo test')
    })

    unhook()
  },
  `
  TAP version 13

  # async hook
  ok 1 - async hook # time = 12.345678ms

  # should wait for async hooks to complete before execution
      ok 1 - async hook should complete before solo test
  ok 2 - should wait for async hooks to complete before execution # time = 0.123456ms

  1..2
  # tests = 2/2 pass
  # asserts = 1/1 pass
  # time = 15.678901ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ hook, solo }) {
    const unhook = hook('failing hook', function () {
      throw new Error('Hook intentionally failed')
    })

    solo('should prevent test execution when hook fails', function (t) {
      t.fail('this should not execute due to hook failure')
    })

    unhook()
  },
  `
  TAP version 13

  # failing hook

  `,
  { exitCode: 1, stderr: { includes: 'Brittle aborted due to an unhandled rejection: Error: Hook intentionally failed' } }
)

await spawner(
  function ({ hook, solo }) {
    const state = { counter: 0 }

    const unhook = hook('shared hook', function () {
      state.counter++
    })

    solo('should execute shared hook only once for first test', function (t) {
      t.is(state.counter, 1, 'hook should execute once for first test')
    })

    solo('should preserve shared hook state for subsequent tests', function (t) {
      t.is(state.counter, 1, 'hook should not execute again for second test')
    })

    unhook()
  },
  `
  TAP version 13

  # shared hook
  ok 1 - shared hook # time = 0.123456ms

  # should execute shared hook only once for first test
      ok 1 - hook should execute once for first test
  ok 2 - should execute shared hook only once for first test # time = 0.234567ms

  # should preserve shared hook state for subsequent tests
      ok 1 - hook should not execute again for second test
  ok 3 - should preserve shared hook state for subsequent tests # time = 0.345678ms

  1..3
  # tests = 3/3 pass
  # asserts = 2/2 pass
  # time = 6.789012ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ hook, solo }) {
    const state = { values: [], cleanupCalled: false }

    const unhook = hook('setup hook', function () {
      state.values.push('setup')
    })

    solo('should properly manage hook and cleanup lifecycle', function (t) {
      t.is(state.values[0], 'setup', 'setup hook should execute')
      t.is(state.cleanupCalled, false, 'cleanup should not be called yet')
    })

    unhook('cleanup hook', function () {
      state.cleanupCalled = true
      console.log('hook cleanup executed')
    })
  },
  `
  TAP version 13

  # setup hook
  ok 1 - setup hook # time = 0.123456ms

  # should properly manage hook and cleanup lifecycle
      ok 1 - setup hook should execute
      ok 2 - cleanup should not be called yet
  ok 2 - should properly manage hook and cleanup lifecycle # time = 0.234567ms

  # cleanup hook
  hook cleanup executed
  ok 3 - cleanup hook # time = 0.045678ms

  1..3
  # tests = 3/3 pass
  # asserts = 2/2 pass
  # time = 7.890123ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
