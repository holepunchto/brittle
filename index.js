'use strict'
const { fileURLToPath } = require('url')
const { readFileSync } = require('fs')
const { AssertionError } = require('assert')
const { EventEmitter, once } = require('events')
const { Console } = require('console')
const yaml = require('tap-yaml')
const deepEqual = require('deep-equal')
const tmatch = require('tmatch')
const SonicBoom = require('sonic-boom')
const StackParser = require('error-stack-parser')
const ss = require('snap-shot-core')
const { serializeError } = require('serialize-error')
const { TestError, TestTypeError, PrimitiveError } = require('./lib/errors')

const {
  kIncre,
  kCount,
  kCounted,
  kError,
  kResolve,
  kReject,
  kTimeout,
  kTeardowns,
  kSnap,
  kInfo,
  kChildren,
  kEnding,
  kSkip,
  kTodo,
  kLevel,
  kInverted,
  kReset,
  kQueue,
  kAssertQ,
  kMain
} = require('./lib/symbols')

const console = new Console(process.stdout, process.stderr)
const parseStack = StackParser.parse.bind(StackParser)
const noop = () => {}
const cwd = process.cwd()
const { constructor: AsyncFunction } = Object.getPrototypeOf(async () => {})
const SNAP = Number.isInteger(+process.env.SNAP) ? !!process.env.SNAP : process.env.SNAP && new RegExp(process.env.SNAP)

Object.hasOwn = Object.hasOwn || ((o, p) => Object.hasOwnProperty.call(o, p))

process.setUncaughtExceptionCaptureCallback((err) => {
  Object.defineProperty(err, 'fatal', { value: true })
  Promise.reject(err)
})

process.on('unhandledRejection', (reason, promise) => {
  if (reason.fatal || promise instanceof Test || reason instanceof TestError || reason instanceof TestTypeError) {
    console.error('Brittle: Fatal Error')
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

async function ender (tests = main[kChildren]) {
  for (const test of tests) {
    const children = test[kChildren]
    const endedTest = (children.length > 0) && await ender(children)
    if (endedTest) return true
    if (test.ended === false) {
      try { await test.end() } catch {}
      return true
    }
  }
  return false
}

process.on('beforeExit', async () => {
  const endedTest = await ender()
  if (endedTest === false && main.ended === false) await main.end()
  // allow another beforeExit
  if (endedTest) setImmediate(() => {})
})

process.once('exit', async () => {
  if (main.ended === false) main.end()
})

class Tap extends EventEmitter {
  constructor (test, output) {
    super()
    this.test = test
    this.chunks = []
    this.flowing = false
    this.tapper = null
    if (!this.test[kMain]) this.begin()
  }

  get output () {
    return this.test.output
  }

  begin () {
    this.tapper = this.tapper || this.flow(this.tap(this.test))
    this.tapper.next().then(({ value = '' }) => {
      this.output.write(value)
      this.emit('begun')
    })
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
    const { value = '', done } = await tap.next()
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
      const { value = '', done } = await tap.next(next)
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
    while (parent = parent?.parent) { // eslint-disable-line
      level += 1
    }
    parent = test.parent
    const indent = Array.from({ length: level + 1 + test[kLevel] }).map(() => '    ').join('')
    const outdent = indent.slice(4)
    let next = test[kMain] && test[kLevel] === 0 ? yield 'TAP version 13\n' : yield
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

        if (parent !== null) {
          parent[kCount]()
        } else {
          await Promise.allSettled(test[kChildren])
        }
        const failSummary = test[kMain] ? (await main[kChildren]).map(({ failing }) => failing).reduce((sum, n) => sum + n, 0) : ''
        const comment = test[kSkip]
          ? '# SKIP\n'
          : (test[kTodo]
              ? '# TODO\n'
              : (main.runner && test[kMain] ? '' : `# time=${test.time}ms\n${failSummary ? `# failing=${failSummary}\n` : ''}`)
            )
        let out = test[kMain]
          ? comment ? `${indent}${comment}${test.runner ? '' : test.advice.join('')}` : ''
          : `${(test[kSkip] || test[kTodo]) && main[kLevel] > 0 ? indent : ''}ok ${test.index} - ${test.description} ${comment}`
        if (test.parent !== null && test.parent[kMain] && !main.runner) out += '\n'
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
        const { message, ok, explanation, count } = next

        let out = `${indent}${ok ? 'ok' : 'not ok'} ${count}`
        out += ` - ${message.trim().replace(/[\n\r]/g, ' ').replace(/\t/g, `${indent}  `)}\n`
        if (!ok) {
          const split = yaml.stringify(explanation).split('\n')
          const lines = split.filter((line) => line.trim()).map((line) => `${indent}  ${line}`).join('\n')
          out += `${indent}  ---\n${lines}\n${indent}  ...\n\n`

          if (test.bail) {
            out += `${indent}Bail out! Failed test - ${this.test.description}\n`
            main.bailing = true
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
        const { value = '' } = await from
        next = yield value
        continue
      }
    } while (true)
  }

  async step (cmd) {
    if (this.tapper === null) await once(this, 'begun')
    if (this.test.parent && this.test.parent[kMain] === false) {
      const from = await this.tapper.next(cmd)
      await this.test.parent.tap.step({ type: 'subsert', from })
      return
    }
    const { value = '', done } = await this.tapper.next(cmd)
    if ('bailing' in main && / {4}Bail out! Failed test -/.test(value)) {
      const match = value.match(/Bail out!.+/)
      this.output.write(value.slice(0, match.index + match[0].length) + '\n')
      if (this.output.flushSync) this.output.flushSync()
      process.exit(1)
    }
    if (done) {
      const closer = this.output === process.stderr || this.output === process.stdout || this.output instanceof SonicBoom ? 'write' : 'end'
      if (value) this.output[closer](value)
      this.emit(cmd.type, cmd)
      return
    }
    if (value) this.output.write(value)
    this.emit(cmd.type, cmd)

    if (!done && cmd.type === 'end') return this.step(cmd)
  }
}

const methods = ['plan', 'end', 'pass', 'fail', 'ok', 'absent', 'is', 'not', 'alike', 'unlike', 'exception', 'execution', 'snapshot', 'comment', 'timeout', 'teardown', 'configure']
const coercables = ['is', 'not', 'alike', 'unlike']
const booms = new Map()
const stackScrub = (err) => {
  if (err && err.stack) {
    const scrubbed = parseStack(err).filter(({ fileName }) => fileName !== __filename)
    if (scrubbed.length > 0) {
      err.stack = `${Error.prototype.toString.call(err)}\n    at ${scrubbed.join('\n    at ').replace(/\?cacheBust=\d+/g, '')}`
    }
  }
  return err
}

class Test extends Promise {
  static get [Symbol.species] () { return Promise }

  constructor (description, options = {}) {
    const resolver = {}
    super((resolve, reject) => { Object.assign(resolver, { resolve, reject }) })
    Object.defineProperties(this, { [kResolve]: { value: resolver.resolve } })
    Object.defineProperties(this, { [kReject]: { value: resolver.reject } })
    this[kInverted] = options[kInverted] || false
    this[kReset](description, options)

    if (this[kMain] === false && this[kSkip] === false && this[kTodo] === false) {
      this.tap.step({ type: 'title', title: this.description })
    } else {
      this[kSnap] = SNAP
      this.runner = false
      this.advice = []
    }

    if (this[kSkip] || this[kTodo]) {
      const end = this.end.bind(this)
      for (const method of methods) this[method] = noop
      for (const method of coercables) this[method].coercively = noop
      end()
    } else {
      for (const method of methods) this[method] = this[method].bind(this)
      for (const method of coercables) {
        this[method].coercively = (actual, expected, message) => this[method](actual, expected, message, false)
      }
    }
  }

  get [Symbol.toStringTag] () {} // just the presence of this corrects the callframe name of this class from Promise to Test

  [kReset] (description = this.description, options = this.options) {
    const start = process.hrtime.bigint()
    const main = description === kMain
    const { parent = null } = options
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

    Object.defineProperty(this, 'failing', {
      configurable: true,
      enumerable: true,
      get () { return 0 },
      set (n) {
        if (n > 0) process.exitCode = 1
        Object.defineProperty(this, 'failing', {
          configurable: true,
          writable: true,
          enumerable: true,
          value: n
        })
      }
    })

    // non-enumerables:
    if (this.assert) {
      this[kEnding] = false
      this[kCounted] = 0
      this[kTeardowns].length = 0
      this[kChildren].length = 0
    } else {
      Object.defineProperties(this, {
        assert: { value: this },
        [kMain]: { value: main },
        [kCounted]: { value: 0, writable: true },
        [kEnding]: { value: false, writable: true },
        [kTeardowns]: { value: [] },
        [kChildren]: { value: [] },
        [kAssertQ]: { value: new PromiseQueue(), configurable: true }
      })
    }

    this.configure(options)

    Object.defineProperty(this, 'tap', { value: new Tap(this, this.output), configurable: true })
  }

  [kError] (err) {
    if (this.error) return
    if (typeof err !== 'object' || err === null) err = new PrimitiveError(err)
    err.test = this.description
    err.plan = this.planned
    err.count = this.count
    err.ended = this.ended
    stackScrub(err)
    clearTimeout(this[kTimeout])
    this[kTimeout] = null
    this.error = err

    if (this.ended) throw Promise.reject(err) // cause unhandled rejection
    if (err.code === 'ERR_CONFIGURE_FIRST') throw Promise.reject(err)

    if (this[kInverted] && this.parent[kMain] === false) {
      err.message += ' (' + this.description + ')'
      this[kReject](err)
    } else {
      if (this[kInverted]) this[kReject](err)
      this.execution(Promise.reject(err), err.message).then(() => {
        if (this[kEnding] === false) this.end().catch(noop)
      })
    }
  }

  [kCount] () {
    this[kCounted] += 1
    if (this[kEnding] && this.planned > 0 && this[kCounted] >= this.planned) return this.end().catch(noop)
  }

  [kIncre] () {
    try {
      if (this.error) throw this.error
      if (this.ended) {
        if (this.planned > 0 && this.count + 1 > this.planned) {
          throw new TestError('ERR_COUNT_EXCEEDS_PLAN_AFTER_END', {
            count: this.count + 1,
            planned: this.planned,
            description: this.description
          })
        }

        throw new TestError('ERR_ASSERT_AFTER_END', { description: this.description })
      }
      this.count += 1
      if (this.count === this.planned) {
        this[kEnding] = true
        return
      }
      if (this.planned > 0 && this.count > this.planned) {
        throw new TestError('ERR_COUNT_EXCEEDS_PLAN', { count: this.count, planned: this.planned })
      }
    } catch (err) {
      this[kError](err)
    }
  }

  configure (options) {
    if (this.count > 0) {
      this[kError](new TestError('ERR_CONFIGURE_FIRST'))
      return
    }
    const {
      timeout = 30000,
      output = this.output || 1,
      bail = this.bail || false,
      serial = false,
      concurrency = this.concurrency || 5
    } = options
    if (typeof output === 'number' && booms.has(output) === false) {
      booms.set(output, new SonicBoom({ fd: output, sync: true }))
    }
    Object.defineProperties(this, {
      output: { value: typeof output === 'number' ? booms.get(output) : output, configurable: true },
      options: { value: options, configurable: true },
      bail: { value: bail, configurable: true },
      concurrency: { value: serial ? 1 : concurrency, configurable: true },
      [kSkip]: { value: options.skip === true, writable: true },
      [kTodo]: { value: options.todo === true, writable: true },
      [kLevel]: { value: options[kLevel] || 0, writable: true }
    })

    if (this[kQueue] && (Object.hasOwn(options, 'concurrency') || serial)) {
      this[kQueue].setConcurrency(this.concurrency)
    } else {
      Object.defineProperty(this, kQueue, {
        value: new PromiseQueue({ concurrency: this.concurrency }),
        configurable: true
      })
    }

    if (this[kMain] === false) this.timeout(timeout)
  }

  async end () {
    await this[kAssertQ].empty()

    if (this.count < this.planned) {
      this[kError](new TestError('ERR_PREMATURE_END', { count: this.count, planned: this.planned, invertedTop: this[kInverted] && this.parent[kMain] }))
    }
    if (this[kMain] === false && this[kSkip] === false && this[kTodo] === false && this.count === 0 && this.planned === 0) {
      this[kError](new TestError('ERR_NO_ASSERTS', { count: this.count, planned: this.planned, invertedTop: this[kInverted] && this.parent[kMain] }))
    }

    const teardowns = this[kTeardowns].slice()
    this[kTeardowns].length = 0
    this[kEnding] = true

    this.time = (Number(process.hrtime.bigint() - this.start)) / 1e6

    await Promise.allSettled(this[kChildren])
    if (this[kCounted] < this.count) {
      await null // tick
      await this.tap.step({ type: 'drain' })
    }

    clearTimeout(this[kTimeout])
    this[kTimeout] = null

    await this.tap.step({ type: 'end', planned: this.planned ? 0 : this.count, description: this.description })

    this.ended = true

    for (const fn of teardowns) await fn()

    this[kResolve](this[kInfo]())
    return this
  }

  [kInfo] () {
    return Object.fromEntries(
      Object.entries(this)
        .filter(([k, v]) => k !== 'parent' && typeof v !== 'function')
    )
  }

  then (onFulfilled, onRejected) {
    return super.then(onFulfilled, onRejected)
  }

  get test () {
    function test (description = !this[kMain] ? `${this.description} - subtest` : 'tbd', opts, fn) {
      if (this[kMain] && this.tap.tapper === null) this.tap.begin()
      if (typeof opts === 'function') {
        fn = opts
        opts = undefined
      }
      opts = opts || { ...this.options }
      opts[kInverted] = !fn
      opts.parent = this

      if (opts.skip || opts.todo || !fn) {
        return new Test(description, opts)
      }

      if (!(fn instanceof AsyncFunction)) {
        const syncFn = fn
        fn = async (...args) => syncFn(...args)
      }

      const assert = new Test(description, opts)
      clearTimeout(assert[kTimeout])
      const promise = this[kQueue].add(async () => {
        try {
          assert.start = process.hrtime.bigint()
          assert.timeout(Object.hasOwn(opts, 'timeout') ? opts.timeout : 30000)
          return await fn(assert)
        } catch (err) {
          assert[kError](err)
        }
      })
      return Object.assign(promise.then(async () => {
        await Promise.allSettled(assert[kChildren])
        if (assert.planned === 0) queueMicrotask(() => assert.end())
        return await assert
      }))
    }
    test.skip = this.skip.bind(this)
    test.todo = this.todo.bind(this)
    test.configure = this.configure.bind(this)
    Object.defineProperty(this, 'test', { value: test.bind(this) })
    test.test = this.test

    return this.test
  }

  skip (description, opts = {}, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }
    opts.skip = true

    return this.test(description, opts, fn)
  }

  todo (description, opts = {}, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }
    opts.todo = true

    return this.test(description, opts, fn)
  }

  async plan (planned, comment) {
    if (typeof planned !== 'number' || planned < 0) throw new TestTypeError('ERR_PLAN_POSITIVE')
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
    this.passing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
    return ok
  }

  async fail (message = 'failed') {
    this[kIncre]()
    const type = 'assert'
    const assert = 'fail'
    const ok = false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.fail)
    this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation })
    return ok
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
    return ok
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
    return ok
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
    return ok
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
    return ok
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
    return ok
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
    return ok
  }

  async exception (functionOrPromise, expectedError, message) {
    async function exception (functionOrPromise, expectedError, message) {
      this[kIncre]()
      if (typeof expectedError === 'string') {
        [message, expectedError] = [expectedError, message]
      }
      const top = originFrame(Test.prototype.exception)
      const pristineMessage = message === undefined
      message = pristineMessage ? 'should throw' : message
      const type = 'assert'
      const assert = 'exception'
      const count = this.count
      let syncThrew = true
      let ok = null
      try {
        if (typeof functionOrPromise === 'function') functionOrPromise = functionOrPromise()
        syncThrew = false
        if (functionOrPromise instanceof Promise && pristineMessage) message = 'should reject'
        await functionOrPromise
        ok = false
      } catch (err) {
        if (syncThrew) await null // tick
        if (!expectedError) {
          ok = true
        } else {
          ok = tmatch(err, expectedError)
        }
      }
      if (ok) this.passing += 1
      else this.failing += 1
      const explanation = explain(ok, message, assert, Test.prototype.exception, false, expectedError, top)
      await this.tap.step({ type, assert, ok, message, count, explanation })
      return ok
    }
    return this[kAssertQ].add(exception.bind(this, functionOrPromise, expectedError, message))
  }

  async execution (functionOrPromise, message) {
    async function execution (functionOrPromise, message) {
      this[kIncre]()
      const top = originFrame(Test.prototype.execution)
      const pristineMessage = message === undefined
      message = pristineMessage ? 'should return' : message
      const type = 'assert'
      const assert = 'execution'
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
      if (ok) this.passing += 1
      else this.failing += 1
      const explanation = explain(ok, message, assert, Test.prototype.execution, error, null, top)
      await this.tap.step({ type, assert, ok, message, count, explanation })
      return ok
    }

    return this[kAssertQ].add(execution.bind(this, functionOrPromise, message))
  }

  async snapshot (actual, message = 'should match snapshot') {
    this[kIncre]()
    if (actual === undefined) actual = `<${actual}>`
    if (typeof actual === 'symbol') actual = `<${actual.toString()}>`
    if (actual instanceof Error) {
      actual = serializeError(actual)
      delete actual.stack
    }
    const top = originFrame(Test.prototype.snapshot)
    const file = fileURLToPath(new URL(top.getFileName(), 'file:'))
    const type = 'assert'
    const assert = 'snapshot'
    const count = this.count
    let ok = true
    let expected = null
    let specName = this.description
    let parent = this.parent
    do {
      if (parent[kMain] === false) specName = `${parent.description} > ${specName}`
    } while (parent = parent.parent) // eslint-disable-line
    const { toJSON } = BigInt.prototype
    BigInt.prototype.toJSON = function () { return this.toString() }
    try {
      ss.core({
        what: actual,
        file: file,
        specName: specName,
        raiser (o) {
          expected = o.expected
          if (deepEqual(o.value, expected) === false) throw new TestError('ERR_SNAPSHOT_MATCH_FAILED')
        },
        ext: '.snapshot.cjs',
        opts: {
          update: main[kSnap] instanceof RegExp ? main[kSnap].test(specName) : main[kSnap],
          useRelativePath: true
        }
      })
    } catch (err) {
      ok = false
      if (err.code !== 'ERR_SNAPSHOT_MATCH_FAILED') this[kError](err)
    } finally {
      BigInt.prototype.toJSON = toJSON
    }
    if (ok) {
      this.passing += 1
    } else {
      this.failing += 1
      main.advice.push(`# Snapshot "${specName}" is failing. To surgically update:\n`)
      if (main.runner) {
        main.advice.push({
          specName,
          file: file,
          advice: `# brittle --snap "${specName}" ${process.argv.slice(2).join(' ')}\n`,
          [Symbol.toPrimitive] () { return this.advice }
        })
      } else {
        main.advice.push(`# SNAP="${specName}" node ${file.replace(cwd, '').slice(1)}\n`)
      }
    }
    const explanation = explain(ok, message, assert, Test.prototype.snapshot, actual, expected, top)
    await this.tap.step({ type, assert, ok, message, count, explanation })
    return ok
  }

  async comment (message) {
    this.tap.step({ type: 'comment', comment: message })
  }

  teardown (fn) {
    if (this.ended || this[kEnding]) {
      this[kError](new TestError('ERR_TEARDOWN_AFTER_END'))
    }
    this[kTeardowns].push(fn)
  }

  timeout (ms) {
    clearTimeout(this[kTimeout])
    Object.defineProperties(this, {
      [kTimeout]: {
        configurable: true,
        writable: true,
        value: setTimeout(() => {
          this[kError](new TestError('ERR_TIMEOUT', { ms }))
        }, ms)
      }
    })
    this[kTimeout].unref()
  }
}

function originFrame (stackStartFunction) {
  const { prepareStackTrace } = Error
  Error.prepareStackTrace = (_, stack) => {
    if (stack[0].getFunctionName() === '[brittle.error]') return null
    if (stack[0].getMethodName() === 'coercively') return stack[1]
    return stack[0]
  }
  const err = {}
  Error.captureStackTrace(err, stackStartFunction)
  const { stack: top } = err
  Error.prepareStackTrace = prepareStackTrace
  return top
}

function explain (ok, message, assert, stackStartFunction, actual, expected, top = !ok && originFrame(stackStartFunction), extra) {
  if (ok) return null

  const err = new AssertionError({ stackStartFunction, message, operator: assert, actual, expected })
  stackScrub(err)
  if (top) {
    err.at = {
      line: top.getLineNumber(),
      column: top.getColumnNumber(),
      file: top.getFileName().replace(/\?cacheBust=\d+/g, '')
    }
    try {
      const code = readFileSync(fileURLToPath(new URL(err.at.file, 'file:')), { encoding: 'utf-8' })
      const split = code.split(/[\n\r]/g)
      const point = Array.from({ length: err.at.column - 1 }).map(() => '-').join('') + '^'
      const source = [...split.slice(err.at.line - 2, err.at.line), point, ...split.slice(err.at.line, err.at.line + 2)]
      err.source = source.join('\n')
    } /* c8 ignore next */ catch {}
  }
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
  }).join('\n').trim()

  if (!info.stack || code === 'ERR_TIMEOUT' || code === 'ERR_PREMATURE_END' || actual?.code === 'ERR_TIMEOUT' || actual?.code === 'ERR_PREMATURE_END') delete info.stack

  if (actual === undefined && expected === undefined) {
    delete info.actual
    delete info.expected
  }
  return info
}

class PromiseQueue extends Array {
  constructor ({ concurrency } = {}) {
    super()
    this.concurrency = concurrency
    this.pending = 0
    this.jobs = []
    this.drain()
  }

  setConcurrency (concurrency) {
    this.concurrency = concurrency
    this.drain()
  }

  async empty () {
    if (this.pending === 0) return
    if (this.length === 0) return
    do {
      await Promise.allSettled(this)
    } while (this.pending > 0)
  }

  add (fn) {
    return new Promise((resolve, reject) => {
      const run = async () => {
        this.pending++
        try { resolve(await fn()) } catch (err) { reject(err) }
        this.pending--
        this.next()
      }
      this.jobs.push(run)
      this.next()
    })
  }

  next () {
    if (this.jobs.length === 0) return false
    if (this.pending >= this.concurrency) return false
    const run = this.jobs.shift()
    if (!run) return false
    this.push(run())
    return true
  }

  drain () {
    while (this.next()) {} // eslint-disable-line
  }
}

const main = new Test(kMain)
module.exports = main.test.bind(main)
module.exports.skip = main.skip.bind(main)
module.exports.todo = main.todo.bind(main)
module.exports.configure = main.configure.bind(main)
module.exports.test = module.exports
module.exports[kMain] = main
