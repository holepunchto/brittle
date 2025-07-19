import { tester } from './helpers/index.js'

const target = global.Bare ?? process

await tester('uncaught exception calls process.exit when only brittle handler exists',
  async function (t) {
    t.plan(2)

    const originalExit = target.exit
    let exitCode

    target.exit = (code) => { exitCode = code }
    t.teardown(() => { target.exit = originalExit })

    setImmediate(() => { throw new Error('test uncaught exception') })
    await new Promise(resolve => setImmediate(resolve))

    t.ok(exitCode !== undefined, 'process.exit should be called')
    t.is(exitCode, 1, 'exit code should be 1')
  },
  `
  TAP version 13

  # uncaught exception calls process.exit when only brittle handler exists
      ok 1 - process.exit should be called
      ok 2 - exit code should be 1
  ok 1 - uncaught exception calls process.exit when only brittle handler exists # time = XXXms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = XXXms

  # ok
  `,
  { exitCode: 0, stderr: { includes: 'Brittle aborted due to an uncaught exception' } }
)

await tester('unhandled rejection calls process.exit when only brittle handler exists',
  async function (t) {
    t.plan(2)

    const originalExit = target.exit
    let exitCode

    target.exit = (code) => { exitCode = code }
    t.teardown(() => { target.exit = originalExit })

    setImmediate(() => { Promise.reject(new Error('test unhandled rejection')) })
    await new Promise(resolve => setImmediate(resolve))

    t.ok(exitCode !== undefined, 'process.exit should be called')
    t.is(exitCode, 1, 'exit code should be 1')
  },
  `
  TAP version 13

  # unhandled rejection calls process.exit when only brittle handler exists
      ok 1 - process.exit should be called
      ok 2 - exit code should be 1
  ok 1 - unhandled rejection calls process.exit when only brittle handler exists # time = XXXms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = XXXms

  # ok
  `,
  { exitCode: 0, stderr: { includes: 'Brittle aborted due to an unhandled rejection' } }
)

await tester('uncaught exception does not call process.exit when other handlers exist',
  async function (t) {
    t.plan(3)

    const originalExit = target.exit
    let exitCode
    let customHandlerError

    target.exit = (code) => { exitCode = code }
    t.teardown(() => { target.exit = originalExit })

    const customHandler = (err) => { customHandlerError = err }
    process.on('uncaughtException', customHandler)
    t.teardown(() => { process.removeListener('uncaughtException', customHandler) })

    setImmediate(() => { throw new Error('test uncaught exception') })
    await new Promise(resolve => setImmediate(resolve))

    t.is(exitCode, undefined, 'process.exit should not be called')
    t.ok(customHandlerError, 'custom handler should be called')
    t.is(customHandlerError.message, 'test uncaught exception', 'custom handler should receive the error')
  },
  `
  TAP version 13

  # uncaught exception does not call process.exit when other handlers exist
      ok 1 - process.exit should not be called
      ok 2 - custom handler should be called
      ok 3 - custom handler should receive the error
  ok 1 - uncaught exception does not call process.exit when other handlers exist # time = XXXms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = XXXms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('unhandled rejection does not call process.exit when other handlers exist',
  async function (t) {
    t.plan(3)

    const originalExit = target.exit
    let exitCode
    let customHandlerError

    target.exit = (code) => { exitCode = code }
    t.teardown(() => { target.exit = originalExit })

    const customHandler = (err) => { customHandlerError = err }
    process.on('unhandledRejection', customHandler)
    t.teardown(() => { process.removeListener('unhandledRejection', customHandler) })

    setImmediate(() => { Promise.reject(new Error('test unhandled rejection')) })
    await new Promise(resolve => setImmediate(resolve))

    t.is(exitCode, undefined, 'process.exit should not be called')
    t.ok(customHandlerError, 'custom handler should be called')
    t.is(customHandlerError.message, 'test unhandled rejection', 'custom handler should receive the error')
  },
  `
  TAP version 13

  # unhandled rejection does not call process.exit when other handlers exist
      ok 1 - process.exit should not be called
      ok 2 - custom handler should be called
      ok 3 - custom handler should receive the error
  ok 1 - unhandled rejection does not call process.exit when other handlers exist # time = XXXms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = XXXms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('uncaught exception handler is unregistered when runner ends',
  function (t) {
    t.plan(1)

    const listeners = process.listeners('uncaughtException')
    const brittleHandlers = listeners.filter(l => l.toString().includes('Brittle aborted'))
    t.is(brittleHandlers.length, 1, 'brittle uncaught exception handler should be registered during test')

    target.on('beforeExit', () => {
      const listenersAtExit = process.listeners('uncaughtException')
      const brittleHandlersAtExit = listenersAtExit.filter(l => l.toString().includes('Brittle aborted'))
      console.log('uncaughtException handlers at exit:', brittleHandlersAtExit.length)
    })

    t.end()
  },
  `
  TAP version 13

  # uncaught exception handler is unregistered when runner ends
      ok 1 - brittle uncaught exception handler should be registered during test
  ok 1 - uncaught exception handler is unregistered when runner ends # time = XXXms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = XXXms

  # ok
  uncaughtException handlers at exit: 0
  `,
  { exitCode: 0, stderr: '' }
)

await tester('unhandled rejection handler is unregistered when runner ends',
  function (t) {
    t.plan(1)

    const listeners = process.listeners('unhandledRejection')
    const brittleHandlers = listeners.filter(l => l.toString().includes('Brittle aborted'))
    t.is(brittleHandlers.length, 1, 'brittle unhandled rejection handler should be registered during test')

    target.on('beforeExit', () => {
      const listenersAtExit = process.listeners('unhandledRejection')
      const brittleHandlersAtExit = listenersAtExit.filter(l => l.toString().includes('Brittle aborted'))
      console.log('unhandledRejection handlers at exit:', brittleHandlersAtExit.length)
    })

    t.end()
  },
  `
  TAP version 13

  # unhandled rejection handler is unregistered when runner ends
      ok 1 - brittle unhandled rejection handler should be registered during test
  ok 1 - unhandled rejection handler is unregistered when runner ends # time = XXXms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = XXXms

  # ok
  unhandledRejection handlers at exit: 0
  `,
  { exitCode: 0, stderr: '' }
)
