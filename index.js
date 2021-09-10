'use strict'
const { fileURLToPath } = require('url')
const { readFileSync } = require('fs')
const { AssertionError } = require('assert')
const yaml = require('tap-yaml')
const deepEqual = require('deep-equal')
const tmatch = require('tmatch')
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
const kTimes = Symbol('brittle.times')
const kChildren = Symbol('brittle.children')
const kEnding = Symbol('brittle.ending')
const cwd = process.cwd()

process.on('unhandledRejection', (reason, promise) => {
  if (promise instanceof Test || reason instanceof TestError) {
    console.error(reason)
    return
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

class Tap {
  constructor (test, output) {
    this.test = test
    this.tapper = this.tap(test)
    this.output = output
    this.tapper.next().then(({ value = '' }) => output.write(value))
  }

  async * tap (test) {
    let backlog = []
    let parent = test.parent
    let level = +!!parent
    let top = parent || test
    while (parent = parent?.parent) {
      level += 1
      top = parent || top
    }
    const indent = Array.from({ length: level }).map(() => '  ')
    try {
      let next = test.parent ? yield : yield 'TAP version 13\n'
      do {
        const { type } = next
        if (type === 'drain') {
          next = yield backlog.filter(Boolean).join('')
          backlog.length = 0
          continue
        }
        if (type === 'end') {
          yield * backlog.filter(Boolean)
          backlog.length = 0

          if (level === 0) {
            await Promise.allSettled(top[kChildren])
            top[kTimes].push((Number(process.hrtime.bigint() - test.start)) / 1e6)
            yield `${indent}# time=${Math.max(...top[kTimes])}ms\n`
          } else {
            top[kTimes].push((Number(process.hrtime.bigint() - test.start)) / 1e6)
          }
          break
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
          const { message, ok, count, explanation } = next
          let out = `${indent}${ok ? 'ok' : 'not ok'} ${count}`
          out += ` - ${message.trim().replace(/[\n\r]/g, ' ').replace(/\t/g, `${indent}  `)}\n`
          if (!ok) {
            const split = yaml.stringify(explanation).split('\n')
            const lines = split.filter((line) => line.trim()).map((line) => `${indent}  ${line}`).join('\n')
            out += `${indent}  ---\n${lines}\n...\n`
          }
          test[kCount]()
          if (count > test[kCounted]) {
            backlog[count] = out
            next = yield
          } else {
            out += backlog.slice(0, test[kCounted] + 1).filter(Boolean).join('')
            backlog = backlog.slice(test[kCounted] + 1)
            next = yield out
          }
          continue
        }
      } while (true)
    } catch (err) {
      queueMicrotask(() => { test[kError](err, Test.constructor) })
    }
  }

  async step (cmd) {
    const { value = '', done } = await this.tapper.next(cmd)
    if (done) {
      const closer = this.output === process.stderr || this.output === process.stdout || this.output instanceof Sink ? 'write' : 'end'
      return this.output[closer](value)
    }
    this.output.write(value)
    if (cmd.type === 'end') return this.step(cmd)
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

class Sink {
  once (evt, fn) { this.output.once(evt, fn) }
  write (chunk) {
    if (this.ready && this.assert.count > 0) {
      for (const chunk of this.backlog) this.output.write(chunk)
      this.backlog.length = 0
      this.output.write(chunk)
      return
    }
    this.backlog.push(chunk)
  }

  init (assert) {
    this.assert = assert
    this.ready = true
  }

  constructor (output, parent) {
    this.assert = null
    this.ready = false
    this.backlog = []
    this.output = output
    this.parent = parent
    this.parent.then(() => {
      for (const chunk of this.backlog) this.output.write(chunk)
      this.backlog.length = 0
    })
  }
}

const methods = ['plan', 'end', 'pass', 'fail', 'ok', 'absent', 'is', 'not', 'alike', 'unlike', 'exception', 'execution', 'comment', 'timeout', 'teardown']
const coercables = ['is', 'not', 'alike', 'unlike']

class Test extends Promise {
  static get [Symbol.species] () { return Promise }
  constructor (description, options = {}) {
    let resolvers
    const { timeout = 30000, output = process.stdout, parent = null } = options
    super((resolve, reject) => { resolvers = { resolve, reject } })
    this.start = process.hrtime.bigint()
    this.parent = parent
    this.description = description
    this.planned = -1
    this.count = 0
    this.error = null

    this.ended = false
    // non-enumerables:
    Object.defineProperties(this, {
      output: { value: output },
      tap: { value: new Tap(this, output) },
      options: { value: options },
      [kCounted]: { value: 0, writable: true },
      [kEnding]: { value: false, writable: true },
      [kThenned]: { value: false, writable: true },
      [kTeardowns]: { value: [] },
      [kTimes]: { value: parent ? null : [] },
      [kChildren]: { value: parent ? null : [] },
      [kResolvers]: { value: resolvers }
    })

    this.timeout(timeout)
    this.output.once('error', (err) => { this[kError](err, this.constructor) })

    this.tap.step({ type: 'comment', comment: this.description })

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
    if (this.ended) throw err
    this[kReject](err)
    this.ended = true
  }

  [kCount] () {
    this[kCounted] += 1
    if (this[kEnding] && this[kCounted] >= this.count) return this.end()
  }

  [kIncre] () {
    if (this.error) throw this.error
    if (this[kEnding] || this.ended) {
      if (this.planned > -1 && this.count + 1 > this.planned) {
        throw new TestError(`test count [${this.count + 1}] exceeds plan [${this.planned}]`)
      }
      throw new TestError('test after end')
    }
    this.count += 1
    if (this.count === this.planned) {
      this[kEnding] = true
      return
    }
    if (this.planned > -1 && this.count > this.planned) {
      throw new TestError(`test count [${this.count}] exceeds plan [${this.planned}]`)
    }
  }

  get done () { return this }
  get [kReject] () { return this[kResolvers].reject }
  get [kResolve] () { return this[kResolvers].resolve }

  async end () {
    if (!this[kEnding]) {
      const count = this.count
      Object.defineProperty(this, 'count', {
        get () { return count },
        set () {
          this[kError](new TestError('test after end'), this.end)
        }
      })
    }
    this[kEnding] = true
    if (this.count < this.planned) {
      throw new TestError('premature end')
    }

    if (this[kCounted] < this.count) {
      queueMicrotask(async () => {
        await this.tap.step({ type: 'drain' })
      })
      return
    }
    clearTimeout(this[kTimeout])
    this[kTimeout] = null
    if (this.planned === -1) await this.tap.step({ type: 'plan', planned: this[kCounted] })
    await this.tap.step({ type: 'end' })
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
    this[kThenned] = true
    if (this.planned === -1 && onFulfilled) this.end()
    return super.then(onFulfilled, onRejected)
  }

  test (description = this ? `${this.description} - subtest` : 'tbd', opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = undefined
    }
    opts = opts || this?.options
    if (this && opts) {
      opts = { ...opts, parent: this }
      opts.output = new Sink(opts.output || this.output, this)
    }

    if (!fn) {
      const assert = new Test(description, opts)
      if (opts?.output instanceof Sink) opts.output.init(assert)
      if (this && this[kChildren]) this[kChildren].push(assert)
      return assert
    }
    if (!(fn instanceof AsyncFunction)) throw TypeError('Brittle: test functions must be async')
    const assert = new Test(description, opts)
    if (opts?.output instanceof Sink) opts.output.init(assert)
    if (this && this[kChildren]) this[kChildren].push(assert)
    return Object.assign(fn(assert).then(() => assert), assert[kInfo]())
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
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async fail (message = 'failed') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'fail'
    const ok = false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.fail)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async ok (assertion, message = 'expected truthy value') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'ok'
    const ok = assertion
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.ok, assertion, true)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async absent (assertion, message = 'expected falsey value') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'absent'
    const ok = !assertion
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.absent, assertion, false)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async is (actual, expected, message = 'should be equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'is'
    const ok = strict ? actual === expected : actual == expected
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.is, actual, expected)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async not (actual, expected, message = 'should not be equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'not'
    const ok = strict ? actual !== expected : actual != expected
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.not, actual, expected)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async alike (actual, expected, message = 'should deep equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'alike'
    const ok = deepEqual(actual, expected, { strict })
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.alike, actual, expected)
    await this.tap.step({ type, assert, ok, message, count, explanation })
  }

  async unlike (actual, expected, message = 'should not deep equal', strict = true) {
    this[kIncre]()
    const type = 'assert'
    const assert = 'unlike'
    const ok = deepEqual(actual, expected, { strict }) === false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.unlike, actual, expected)
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
    if (typeof expectedError === 'string') {
      message = expectedError
      expectedError = undefined
    }
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

module.exports = Test.prototype.test
