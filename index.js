'use strict'
const { fileURLToPath } = require('url')
const { readFileSync } = require('fs')
const { AssertionError } = require('assert')
const yaml = require('tap-yaml')
const deepEqual = require('deep-equal')
const tmatch = require('tmatch')
const grace = require('close-with-grace')
const SonicBoom = require('sonic-boom')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

const kIncre = Symbol('brittle.increment')
const kCount = Symbol('brittle.count')
const kCounted = Symbol('brittle.counted')
const kResolvers = Symbol('brittle.resolvers')
const kError = Symbol('brittle.error')
const kResolve = Symbol('brittle.resolve')
const kReject = Symbol('brittle.reject')
const kThenned = Symbol('brittle.thenned')
const kTimeout = Symbol('brittle.timeout')
const kTeardowns = Symbol('brittle.teardowns')
const kInfo = Symbol('brittle.info')
const kChildren = Symbol('brittle.children')
const kEnding = Symbol('brittle.ending')
const kMain = Symbol('brittle.main')
const cwd = process.cwd()
const noop = () => {}

process.on('unhandledRejection', (reason, promise) => {
  if (promise instanceof Test || reason instanceof TestError) {
    console.error(reason)
    process.exit(1)
  }
  const name = 'UnhandledPromiseRejectionWarning'
  const warning = new Error(
    'Unhandled promise rejection. This error originated either by ' +
      'throwing inside of an async function without a catch block, ' +
      'or by rejecting a promise which was not handled with .catch(). ' +
      'To terminate the node process on unhandled promise ' +
      'rejection, use the CLI flag `--unhandled-rejections=strict` (see ' +
      'https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). '
  )
  warning.name = name
  try {
    if (reason instanceof Error) {
      warning.stack = reason.stack
      process.emitWarning(reason.stack, name)
    } else {
      process.emitWarning(reason, name)
    }
  } catch {}

  process.emitWarning(warning)
})
const { close } = grace({ delay: 50 }, async function closer ({ signal }) {
  if (closer.closed) return
  closer.closed = true
  if (signal) return
  await main
})
process.on('exit', close)
process.on('beforeExit', close)

class Tap {
  constructor (test, output) {
    this.test = test
    this.chunks = []
    this.commands = []
    this.flowing = false
    this.tapper = this.flow(this.tap(test))
    this.output = output
    this.tapper.next().then(({ value = '' }) => output.write(value))
  }

  buildQueue () {
    let cur = this.test
    let parent = cur.parent
    const queue = parent ? parent[kChildren].slice(0, parent[kChildren].indexOf(cur)) : []
    cur = parent
    while (parent = parent?.parent) { // eslint-disable-line
      queue.push(...parent[kChildren].slice(0, parent[kChildren].indexOf(cur)))
      cur = parent
    }
    return queue
  }

  async * flow (tap) {
    const { value, done } = await tap.next()
    if (done) return
    const queue = this.buildQueue()
    this.queue = queue
    this.flowing = queue.length === 0
    let next = this.flowing ? yield value : yield
    const backlog = []
    if (value && !this.flowing) backlog.push(value)
    const ready = queue.length && Promise.allSettled(queue)
    if (queue.length) ready.then(() => { this.flowing = true })
    while (true) {
      this.commands.push(next)

      const { value, done } = await tap.next(next)
      if (this.flowing) {
        const out = backlog.length ? backlog.join('') + value : value
        next = yield out
        if (backlog.length) backlog.length = 0
      } else {
        backlog.push(value)
        next = yield
      }

      if (done) {
        await ready
        yield backlog.join('')
        backlog.length = 0
        queue.length = 0
        break
      }
    }
  }

  async * tap (test) {
    let parent = test.parent
    let level = +!!parent - 1
    let top = parent || test
    while (parent = parent?.parent) { // eslint-disable-line
      level += 1
      top = parent || top
    }
    parent = test.parent
    const indent = Array.from({ length: level + 1 }).map(() => '  ').join('')
    const outdent = indent.slice(2)
    try {
      let next = test[kMain] ? yield 'TAP version 13\n' : yield
      do {
        const { type } = next
        if (type === 'drain') {
          next = yield this.chunks.filter(Boolean).join('')
          this.chunks.length = 0
          continue
        }

        if (type === 'end') {
          await Promise.allSettled(this.queue)
          yield * this.chunks.filter(Boolean)
          this.chunks.length = 0

          test.time = (Number(process.hrtime.bigint() - test.start)) / 1e6

          if (parent !== null) {
            parent[kCount]()
          } else {
            await Promise.allSettled(test[kChildren])
          }

          let out = test[kMain]
            ? `# time=${test.time}ms\n`
            : `ok ${test.index} - ${test.description} # time=${test.time}ms\n`
          if (test.failing) out = `not ${out}`
          out = `${outdent}${out}`
          const plan = next.planned ? `${indent}1..${test.count}\n` : ''

          yield `${plan}${out}`
          break
        }
        if (type === 'title') {
          const { title } = next
          next = yield `${outdent}# ${title.trim()}\n`
          continue
        }
        if (type === 'comment') {
          const { comment } = next
          next = yield `${indent}# ${comment.trim()}\n`
          continue
        }
        if (type === 'plan') {
          const { planned, comment } = next
          next = yield `${indent}1..${planned}${comment ? ` # ${comment.trim()}` : ''}\n`
          continue
        }
        if (type === 'assert') {
          const { message, ok, explanation } = next
          const { count } = next

          let out = `${indent}${ok ? 'ok' : 'not ok'} ${count}`
          out += ` - ${message.trim().replace(/[\n\r]/g, ' ').replace(/\t/g, `${indent}  `)}\n`
          if (!ok) {
            const split = yaml.stringify(explanation).split('\n')
            const lines = split.filter((line) => line.trim()).map((line) => `${indent}  ${line}`).join('\n')
            out += `${indent}  ---\n${lines}\n${indent}  ...\n`
            if (test.bail) {
              out += `${indent}Bail out! Failed test - ${this.test.description}\n`
            }
          }
          test[kCount]()
          if (count > test[kCounted]) {
            this.chunks[count] = out
            next = yield
          } else {
            out += this.chunks.slice(0, test[kCounted] + 1).filter(Boolean).join('')
            this.chunks = this.chunks.slice(test[kCounted] + 1)
            next = yield out
          }
          continue
        }
        if (type === 'subsert') {
          const { from } = next
          const { value } = await from
          next = yield value
          continue
        }
      } while (true)
    } catch (err) {
      queueMicrotask(() => { test[kError](err, Test.constructor) })
    }
  }

  async step (cmd) {
    if (this.test.parent && this.test.parent[kMain] === false) {
      const from = this.tapper.next(cmd)
      await this.test.parent.tap.step({ type: 'subsert', from })
      return
    }
    const { value = '', done } = await this.tapper.next(cmd)
    if (done) {
      const closer = this.output === process.stderr || this.output === process.stdout || this.output instanceof SonicBoom ? 'write' : 'end'
      return this.output[closer](value)
    }
    this.output.write(value)

    if (!done && cmd.type === 'end') return this.step(cmd)
  }
}

class TestError extends Error {
  constructor (...args) {
    super(...args)
    this.name = 'Error'
  }
}

class Timeout extends TestError {
  constructor (ms) {
    super(`test timed out after ${ms}ms`)
  }
}

const methods = ['plan', 'end', 'pass', 'fail', 'ok', 'absent', 'is', 'not', 'alike', 'unlike', 'exception', 'execution', 'comment', 'timeout', 'teardown', 'configure']
const coercables = ['is', 'not', 'alike', 'unlike']

class Test extends Promise {
  static get [Symbol.species] () { return Promise }
  constructor (description, options = {}) {
    const start = process.hrtime.bigint()
    const main = description === kMain
    let resolvers
    const { parent = null } = options
    super((resolve, reject) => { resolvers = { resolve, reject } })
    if (parent) {
      parent[kChildren].push(this)
      parent[kIncre]()
    }
    this.index = parent?.count || 0
    this.start = start
    this.parent = parent
    this.description = main ? '' : description
    this.planned = 0
    this.count = 0
    this.passing = 0
    this.failing = 0
    this.error = null
    this.time = null
    this.ended = false
    this.configure(options)
    // non-enumerables:
    Object.defineProperties(this, {
      [kMain]: { value: main },
      [kCounted]: { value: 0, writable: true },
      [kEnding]: { value: false, writable: true },
      [kThenned]: { value: false, writable: true },
      [kTeardowns]: { value: [] },
      [kChildren]: { value: [] },
      [kResolvers]: { value: resolvers }
    })
    Object.defineProperty(this, 'tap', { value: new Tap(this, this.output) })
    this.output.once('error', (err) => { this[kError](err, this.constructor) })
    if (this[kMain] === false) this.tap.step({ type: 'title', title: this.description })

    for (const method of methods) this[method] = this[method].bind(this)
    for (const method of coercables) {
      this[method].coercively = (actual, expected, message) => this[method](actual, expected, message, false)
    }
  }

  [kError] (err, from) {
    if (this.error) return
    if (from) Error.captureStackTrace(err, from)
    err.test = this.description
    err.plan = this.planned
    err.count = this.count
    err.ended = this.ended
    if (this.count < this.planned) err.message += ` [test count (${this.count}) did not reach plan (${this.planned})]`
    else if (this[kThenned]) err.message += ' [test ended by awaiting or calling then]'
    this.error = err
    clearTimeout(this[kTimeout])
    this[kTimeout] = null
    if (this.ended) throw Promise.reject(err)
    this[kReject](err)
    this.ended = true
  }

  [kCount] () {
    this[kCounted] += 1
    if (this[kEnding] && this[kCounted] >= this.count) return this.end()
  }

  [kIncre] () {
    try {
      if (this.error) throw this.error
      if (this.ended) {
        if (this.planned > 0 && this.count + 1 > this.planned) {
          throw new TestError(`test count [${this.count + 1}] exceeds plan [${this.planned}]`)
        }

        throw new TestError('test after end')
      }
      this.count += 1
      if (this.count === this.planned) {
        this[kEnding] = true
        return
      }
      if (this.planned > 0 && this.count > this.planned) {
        throw new TestError(`test count [${this.count}] exceeds plan [${this.planned}]`)
      }
    } catch (err) {
      this[kError](err, this[kIncre])
    }
  }

  get assert () { return this }
  get [kReject] () { return this[kResolvers].reject }
  get [kResolve] () { return this[kResolvers].resolve }

  configure (options) {
    if (this.count > 0) {
      this[kError](new TestError('Brittle: Configuration must happen prior to registering any tests'), this.configure)
      return
    }
    const { timeout = 3000, output = 1, bail = false } = options
    Object.defineProperties(this, {
      output: { value: typeof output === 'number' ? new SonicBoom({ fd: output }) : output, configurable: true },
      options: { value: options, configurable: true },
      bail: { value: bail, configurable: true }
    })
    if (this[kMain] === false) this.timeout(timeout)
  }

  async end () {
    if (this.count < this.planned) {
      throw new TestError('premature end')
    }
    if (this[kCounted] < this.count) {
      await null // tick
      await this.tap.step({ type: 'drain' })
    }
    clearTimeout(this[kTimeout])
    this[kTimeout] = null
    this[kEnding] = true

    await this.tap.step({ type: 'end', planned: this.planned ? 0 : this.count, description: this.description })

    this.ended = true
    for (const fn of this[kTeardowns]) await fn()
    this[kResolve](this[kInfo]())
  }

  [kInfo] () {
    return Object.fromEntries(
      Object.entries(this)
        .filter(([k, v]) => k !== 'parent' && typeof v !== 'function')
    )
  }

  then (onFulfilled, onRejected) {
    if (!this[kThenned] && this.planned === 0 && onFulfilled) this.end()

    this[kThenned] = true
    return super.then(onFulfilled, (err) => {
      if (this.ended) {
        console.error(err)
        process.exit(1)
      }
      onRejected(err)
    })
  }

  get test () {
    function test (description = !this[kMain] ? `${this.description} - subtest` : 'tbd', opts, fn) {
      if (typeof opts === 'function') {
        fn = opts
        opts = undefined
      }
      opts = opts || this.options
      if (this && opts) {
        opts = {
          output: this.options.output,
          bail: this.options.bail,
          ...opts,
          parent: this
        }
      }

      if (!fn) return new Test(description, opts)
      if (!(fn instanceof AsyncFunction)) throw TypeError('Brittle: test functions must be async')

      const assert = new Test(description, opts)
      const promise = fn(assert)
      promise.catch((err) => { this[kError](err) })
      return Object.assign(promise.then(async () => {
        await Promise.allSettled(assert[kChildren])
        return await assert
      }), assert[kInfo]())
    }
    test.skip = this.skip.bind(this)
    test.todo = this.todo.bind(this)
    test.configure = this.configure.bind(this)
    test.test = test
    Object.defineProperty(this, 'test', { value: test })
    return test
  }

  skip (description = !this[kMain] ? `${this.description} - subtest` : 'tbd', opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = undefined
    }
    if (!fn) {
      this.pass(`${description} # SKIP`)
      return new Skip(description, opts)
    }
    if (fn && !(fn instanceof AsyncFunction)) throw TypeError('Brittle: test functions must be async')

    this.pass(`${description} # SKIP`)
  }

  todo (description = !this[kMain] ? `${this.description} - subtest` : 'tbd', opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = undefined
    }
    if (fn && !(fn instanceof AsyncFunction)) throw TypeError('Brittle: test functions must be async')
    this.pass(`${description} # TODO`)
  }

  async plan (planned, comment) {
    if (typeof planned !== 'number' || planned < 0) throw new TypeError('plan must take a positive number')
    this.planned = planned
    await this.tap.step({ type: 'plan', planned, comment })
  }

  async pass (message = 'passed') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'pass'
    const ok = true
    const count = this.count
    const explanation = null
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async fail (message = 'failed') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'fail'
    const ok = false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.fail)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async ok (assertion, message = 'expected truthy value') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'ok'
    const ok = assertion
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.ok, assertion, true)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async absent (assertion, message = 'expected falsey value') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'absent'
    const ok = !assertion
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.absent, assertion, false)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async is (actual, expected, message = 'should be equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'is'
    const ok = strict ? actual === expected : actual == expected // eslint-disable-line
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.is, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async not (actual, expected, message = 'should not be equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'not'
    const ok = strict ? actual !== expected : actual != expected // eslint-disable-line
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.not, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async alike (actual, expected, message = 'should deep equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'alike'
    const ok = deepEqual(actual, expected, { strict })
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.alike, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async unlike (actual, expected, message = 'should not deep equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'unlike'
    const ok = deepEqual(actual, expected, { strict }) === false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.unlike, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async exception (functionOrPromise, expectedError, message) {
    this[kIncre]()
    if (typeof expectedError === 'string') {
      message = expectedError
      expectedError = undefined
    }
    const top = originFrame(Test.prototype.execution)
    const pristineMessage = message === undefined
    message = pristineMessage ? 'should throw' : message
    const type = 'assert'
    const assert = 'exception'
    const count = this.count
    let ok = null
    try {
      if (typeof functionOrPromise === 'function') functionOrPromise = functionOrPromise()
      if (pristineMessage) message = 'should reject'
      await functionOrPromise
      ok = false
    } catch (err) {
      if (!expectedError) {
        ok = true
      } else {
        ok = tmatch(err, expectedError)
      }
    }
    const explanation = explain(ok, message, assert, Test.prototype.exception, false, expectedError, top)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async execution (functionOrPromise, message) {
    this[kIncre]()
    const top = originFrame(Test.prototype.execution)
    const pristineMessage = message === undefined
    message = pristineMessage ? 'should complete' : message
    const type = 'assert'
    const assert = 'exception'
    const count = this.count
    let ok = false
    let error = null
    try {
      if (typeof functionOrPromise === 'function') functionOrPromise = functionOrPromise()
      if (functionOrPromise instanceof Promise && pristineMessage) message = 'should resolve'
      await functionOrPromise
      ok = true
    } catch (err) {
      error = err
    }
    const explanation = explain(ok, message, assert, Test.prototype.execution, error, null, top)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async comment (message) {
    this.tap.step({ type: 'comment', comment: message })
  }

  teardown (fn) {
    if (this.ended || this[kEnding]) throw new TestError('teardown after end')
    this[kTeardowns].push(fn)
  }

  timeout (ms) {
    clearTimeout(this[kTimeout])
    Object.defineProperties(this, {
      [kTimeout]: {
        configurable: true,
        writable: true,
        value: setTimeout(() => {
          if (this.ended) return
          this[kError](new Timeout(ms), this.constructor)
        }, ms)
      }
    })
  }
}

class Skip extends Test {}
class Todo extends Test {}
for (const method of methods) Skip.prototype[method] = Todo.prototype[method] = noop

function originFrame (stackStartFunction) {
  const { prepareStackTrace } = Error
  Error.prepareStackTrace = (_, stack) => stack[0]
  const err = {}
  Error.captureStackTrace(err, stackStartFunction)
  const { stack: top } = err
  Error.prepareStackTrace = prepareStackTrace
  return top
}

function explain (ok, message, assert, stackStartFunction, actual, expected, top = !ok && originFrame(stackStartFunction)) {
  if (ok) return null

  const err = new AssertionError({ stackStartFunction, message, operator: assert, actual, expected })
  err.at = {
    line: top.getLineNumber(),
    column: top.getColumnNumber(),
    file: top.getFileName()
  }
  try {
    const code = readFileSync(fileURLToPath(new URL(err.at.file, 'file:')), { encoding: 'utf-8' })
    const split = code.split(/[\n\r]/g)
    const point = Array.from({ length: err.at.column - 1 }).map(() => '-').join('') + '^'
    const source = [...split.slice(err.at.line - 2, err.at.line), point, ...split.slice(err.at.line, err.at.line + 2)]
    err.source = source.join('\n')
  } catch {}
  const { code, generatedMessage, ...info } = err
  err.code = code
  err.generatedMessage = generatedMessage
  Object.defineProperty(info, 'err', { value: err })
  info.stack = err.stack.split('\n').slice(1).map((line) => {
    let match = false
    line = line.slice(7).replace(cwd, () => {
      match = true
      return ''
    })
    if (match) line = line.replace(/file:\/?\/?\/?/, '')
    return line
  }).join('\n')
  if (!info.stack) delete info.stack
  return info
}

const main = new Test(kMain)
module.exports = main.test.bind(main)
module.exports.skip = main.skip.bind(main)
module.exports.todo = main.todo.bind(main)
module.exports.configure = main.configure.bind(main)
module.exports.test = module.exports
