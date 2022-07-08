'use strict'
const { fileURLToPath } = require('url')
const { readFileSync } = require('fs')
const { AssertionError } = require('assert')
const { Console } = require('console')
const { format } = require('util')
const yaml = require('tap-yaml')
const deepEqual = require('deep-equal')
const tmatch = require('tmatch')
const SonicBoom = require('sonic-boom')
const StackParser = require('error-stack-parser')
const winr = require('why-is-node-running')
const ss = require('snap-shot-core')
const { serializeError } = require('serialize-error')

const { TestError, TestTypeError, PrimitiveError } = require('./lib/errors')
const {
  kIncre,
  kCount,
  kIndex,
  kCounted,
  kError,
  kResolve,
  kReject,
  kTimeout,
  kTimedout,
  kTeardowns,
  kSnap,
  kInfo,
  kChildren,
  kEnding,
  kSkip,
  kTodo,
  kSolo,
  kLevel,
  kInverted,
  kInject,
  kReset,
  kQueue,
  kAssertQ,
  kComplete,
  kDone,
  kMain
} = require('./lib/symbols')

const console = new Console(process.stdout, process.stderr)
const parseStack = StackParser.parse.bind(StackParser)
const noop = () => {}
const cwd = process.cwd()
const { constructor: AsyncFunction } = Object.getPrototypeOf(async () => {})
const env = process.env
const LEVEL = Number.isInteger(+env.BRITTLE_INTERNAL_LEVEL) ? +env.BRITTLE_INTERNAL_LEVEL : 0
const SNAP = Number.isInteger(+env.SNAP) ? !!env.SNAP : env.SNAP && new RegExp(env.SNAP)
const SOLO = Number.isInteger(+env.SOLO) ? !!env.SOLO : env.SOLO && new RegExp(env.SOLO)
const TIMEOUT = Number.isInteger(+env.BRITTLE_TIMEOUT) ? +env.BRITTLE_TIMEOUT : 30000

Object.hasOwn = Object.hasOwn || ((o, p) => Object.hasOwnProperty.call(o, p))

process.setUncaughtExceptionCaptureCallback((err) => {
  Object.defineProperty(err, 'fatal', { value: true })
  if (!process.emit('uncaughtException', err)) {
    Promise.reject(err)
  }
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
    if (endedTest) return
    if (test.ended === false) {
      try { await test.end() } catch {}
      return true
    }
  }
  return false
}

const drain = async (...args) => {
  const endedTest = await ender()
  if (endedTest === false && main.ended === false) await main.end()
  // allow another beforeExit
  if (endedTest) setImmediate(() => {})
}

process.on('beforeExit', async () => {
  await drain()
})

process.once('exit', async () => {
  if (main.ended === false) main.end()
})

process.prependListener('SIGINT', async function why () {
  process.removeListener('SIGINT', why)
  const listeners = process.rawListeners('SIGINT')
  process.removeAllListeners('SIGINT')
  await main.comment('Active Handles Report')
  winr({
    error (...args) {
      main.comment(format(...args))
    }
  })
  await drain()
  // honour any other sigint listeners
  for (const listener of listeners) await listener()
  setTimeout(() => { process.exit(127) }, 0).unref() // allow for output flushing before exit
})

class Writer {
  constructor () {
    this.index = 0
    this.ending = false
    this.ended = false
    this.length = 0
    this.pos = 0
    this.cache = {}
    this.done = null
    this.iterated = new Promise((resolve) => { this.done = resolve })
  }

  write (str, idx) {
    if (this.ended) throw Error('writer ended')
    if (typeof idx !== 'number') throw Error('idx required')
    if (idx < this.pos) throw Error(`processed position already surpasses idx ${idx}`)
    if (idx in this.cache) throw Error(`idx ${idx} already set ${str} -> ${this.cache[idx]}`)
    this.cache[idx] = str
    if (idx >= this.length) this.length = idx + 1
  }

  end () {
    if (this.ending) return
    this.ending = true
    for (let i = 0; i <= this.length; i++) {
      const item = this.cache[i]
      if (item instanceof this.constructor) item.end()
    }
    // set an active handle to allow for final output
    this.constructor.tick.ref()
  }

  * release (stopper) {
    for (let i = 0; i <= this.length; i++) {
      const item = this.cache[i]
      if (item === undefined) continue
      this.cache[i] = undefined
      if (item instanceof this.constructor) {
        yield * item.release()
        if (stopper && item === stopper) break
      } else {
        yield item
      }
    }
  }

  async * [Symbol.asyncIterator] () {
    const idle = (resolve) => this.constructor.idles.push(resolve)

    while (true) {
      if (this.ended) break
      if (this.ending === false && (this.index in this.cache) === false) {
        await new Promise(idle)
        if (this.ending === false) continue
      }
      const item = this.cache[this.index]
      this.cache[this.index] = undefined
      if (this.ending === false || item !== undefined) {
        this.pos = this.index
        if (item instanceof this.constructor) {
          yield * item
        } else {
          yield item
        }
      }
      this.index += 1
      if (this.ending && this.index >= this.length) this.ended = true
      // debugging:
      // if (item === undefined && this.ended === false) {
      //   yield '# ITEM MISSING ' + this.index - 1
      // }
    }

    this.done()
  }
}
// TODO: use static keyword on class when standard linter can handle it
Writer.idles = []
Writer.pending = []
Writer.tick = setInterval(() => {
  for (const idle of Writer.idles) idle()
  Writer.idles.length = 0
  Writer.pending = Writer.pending.filter(({ ended }) => ended === false)
  if (Writer.pending.length === 0) Writer.tick.unref()
}, 3).unref()

const protocol = (output) => {
  if (protocol.written) return
  output.write('TAP version 13\n')
  protocol.written = true
}

class Tap {
  constructor (test) {
    this.test = test
    this.writer = new Writer()
    if (this.test[kMain]) {
      this.level = 0
      this.indent = this.test.runner ? '    ' : ''
    } else {
      let parent = this.test.parent
      let level = +!!parent - 1
      while (parent = parent?.parent) { // eslint-disable-line
        level += 1
      }
      this.level = level
      this.indent = Array.from({ length: this.level + 1 + this.test[kLevel] }).map(() => '    ').join('')
    }

    this.outdent = this.indent.slice(4)
    this.protocol = protocol
    if (this.test[kMain]) this._init().catch((err) => this.test[kError](err))
  }

  get output () {
    return this.test.output
  }

  async _init () {
    for await (const out of this.writer) this.output.write(out)
  }

  release (stopper) {
    for (const out of this.writer.release(stopper)) this.output.write(out)
  }

  async tapify (cmd) {
    const { test, indent, outdent } = this
    const { type } = cmd

    if (type === 'end') {
      const failSummary = test[kMain] ? (await test[kChildren]).map(({ failing }) => failing).reduce((sum, n) => sum + n, 0) : ''
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

      const plan = test[kSkip] === false && cmd.planned ? `${indent}1..${test.count}\n` : ''
      return `${plan}${out}`
    }

    if (type === 'title') {
      if (test[kSkip] || test[kTodo]) return ''
      const { title } = cmd
      return `${outdent}# ${title.trim()}\n`
    }

    if (type === 'comment') {
      if (test[kSkip] || test[kTodo]) return ''
      const { comment, raw = false } = cmd
      return raw ? comment : `${indent}# ${comment.trim()}\n`
    }
    if (type === 'plan') {
      if (test[kSkip] || test[kTodo]) return ''
      const { planned, comment } = cmd
      return `${indent}1..${planned}${comment ? ` # ${comment.trim()}` : ''}\n`
    }
    if (type === 'assert') {
      if (test[kSkip] || test[kTodo]) return ''
      const { message, ok, explanation, count } = cmd

      let out = `${indent}${ok ? 'ok' : 'not ok'} ${count}`
      out += ` - ${message.trim().replace(/[\n\r]/g, ' ').replace(/\t/g, `${indent}  `)}\n`
      if (!ok) {
        const split = yaml.stringify(explanation).split('\n')
        const lines = split.filter((line) => line.trim()).map((line) => `${indent}  ${line}`).join('\n')
        out += `${indent}  ---\n${lines}\n${indent}  ...\n\n`

        if (test.bail) {
          out += `${indent}Bail out! Failed test - ${this.test.description}\n`
        }
      }
      test[kCount]()

      return out
    }
  }

  async step (cmd) {
    if (this.test.parent && this.test.parent[kSolo] === false) {
      await null // tick
      if (this.test.parent[kSolo]) {
        if (this.test[kSolo] === false) this.test[kSkip] = true
      }
    }

    const value = await this.tapify(cmd)
    const bail = (this.test.bail && cmd.type === 'assert' && cmd.ok === false)

    try {
      if (cmd.type === 'title') {
        this.test.parent.tap.writer.write(this.writer, cmd.pidx)
        this.writer.write(value, 0)
      } else if (typeof cmd.idx === 'number') {
        this.writer.write(value, cmd.idx)
      }
      if (bail) {
        const prior = this.test.parent[kChildren].slice(0, this.test.parent[kChildren].indexOf(this.test))
        await Promise.allSettled(prior)
        main.tap.release(this.writer)
        process.exit(1)
      }
    } catch (err) {
      this.test[kError](err)
    }
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
    this[kSolo] = options[kSolo] || false
    this[kReset](description, options)

    if (this[kMain] === false) {
      const pidx = (options.parent) ? options.parent[kIndex]++ : 0
      this.tap.step({ type: 'title', title: this.description, pidx, idx: this[kIndex]++ })
    } else {
      this[kSnap] = SNAP
      this.runner = false
      this.advice = []
    }

    if (this[kSkip] || this[kTodo]) {
      const end = this.end.bind(this)
      for (const method of methods) this[method] = noop
      for (const method of coercables) this[method].coercively = noop
      this.exception.all = noop
      end()
    } else {
      for (const method of methods) {
        this[method] = this[method].bind(this)
        if (method === 'exception') {
          this[method].all = (functionOrPromise, expectedError, message) => {
            return this[method](functionOrPromise, expectedError, message, true)
          }
        }
      }
      for (const method of coercables) {
        this[method].coercively = (actual, expected, message) => this[method](actual, expected, message, false)
      }
    }
  }

  get [Symbol.toStringTag] () {} // just the presence of this corrects the callframe name of this class from Promise to Test

  [kReset] (description = this.description, options = this.options) {
    const main = description === kMain
    const { parent = null } = options
    if (parent) {
      parent[kChildren].push(this)
      parent[kIncre]()
    }
    this.index = parent?.count || 0
    this.start = main ? process.hrtime.bigint() : 0n
    this.parent = parent
    this.description = main ? '' : description
    this.planned = 0
    this.count = 0
    this.passing = 0
    this.failing = 0
    this.error = null
    this.time = null
    this.ended = false
    this.done = false

    this[kIndex] = 0

    this[kComplete] = null
    this[kDone] = new Promise((resolve) => { this[kComplete] = resolve })

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

    Object.defineProperty(this, 'tap', { value: new Tap(this), configurable: true })
  }

  [kError] (err) {
    if (this.error) return
    if (typeof err !== 'object' || err === null) err = new PrimitiveError(err)
    if ('trace' in err) return
    err.test = this.description
    err.plan = this.planned
    err.count = this.count
    err.ended = this.ended
    stackScrub(err)
    clearTimeout(this[kTimeout])
    if (this[kTimedout]) this[kTimedout].clear()
    this[kTimeout] = null
    this[kTimedout] = null
    this.error = err

    if (this.ended || err.code === 'ERR_CONFIGURE_FIRST') {
      this.tap.release()
      throw Promise.reject(err) // cause unhandled rejection
    }

    if (this[kInverted]) {
      err.trace = { ...err }
      this.count += 1
      this.execution(Promise.reject(err), err.message)
      this[kReject](err)
      if (this[kEnding] === false) this.end().catch(noop)
    } else {
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
    if (options.concurrent) options.concurrency = 5
    if (options.concurrency === true) options.concurrency = 5
    const {
      timeout = TIMEOUT,
      output = this.output || 1,
      bail = this.bail || false,
      concurrency = this.concurrency || 1
    } = options

    if (typeof output === 'number' && booms.has(output) === false) {
      booms.set(output, new SonicBoom({ fd: output, sync: true }))
    }
    Object.defineProperties(this, {
      output: { value: typeof output === 'number' ? booms.get(output) : output, configurable: true },
      options: { value: options, configurable: true },
      bail: { value: bail, configurable: true },
      concurrency: { value: concurrency, configurable: true },
      [kSkip]: { value: options.skip === true, writable: true },
      [kTodo]: { value: options.todo === true, writable: true },
      [kLevel]: { value: options[kLevel] || LEVEL, writable: true }
    })
    if (this[kQueue]) {
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
      if (this.start === 0n) {
        await null // tick
        return
      }
      this[kError](new TestError('ERR_NO_ASSERTS', { count: this.count, planned: this.planned, invertedTop: this[kInverted] && this.parent[kMain] }))
    }

    const teardowns = this[kTeardowns].slice()
    this[kTeardowns].length = 0
    this[kEnding] = true

    this.time = (Number(process.hrtime.bigint() - this.start)) / 1e6

    await Promise.allSettled(this[kChildren])

    clearTimeout(this[kTimeout])
    if (this[kTimedout]) this[kTimedout].clear()
    this[kTimeout] = null
    this[kTimedout] = null

    if (this.ended === false) {
      const idx = this[kIndex]++
      this.ended = true
      await this.tap.step({ type: 'end', planned: this.planned ? 0 : this.count, description: this.description, idx })
      for (const fn of teardowns) {
        try { await fn() } catch (err) { this[kError](err) }
      }
    }

    this[kResolve](this[kInfo]())
    if (this.parent) this.parent[kCount]()

    if (this.done) return this

    await this.tap.writer.end()

    this[kComplete]()
    this.done = true

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
      if (this[kMain]) this.tap.protocol(this.output)
      if (typeof opts === 'function') {
        fn = opts
        opts = undefined
      }
      opts = opts || { ...this.options }
      opts[kInverted] = !fn
      opts.parent = this

      if (this[kSolo] && !opts[kSolo]) opts.skip = true

      if (opts.skip || opts.todo || !fn) {
        return new Test(description, opts)
      }

      if (!(fn instanceof AsyncFunction)) {
        const syncFn = fn
        fn = async (...args) => syncFn(...args)
      }

      const assert = new Test(description, opts)
      clearTimeout(assert[kTimeout])
      if (this[kTimedout]) this[kTimedout].clear()
      const promise = this[kQueue].add(async () => {
        try {
          await null // tick
          if (assert[kSkip]) return
          assert.start = process.hrtime.bigint()
          assert.timeout(Object.hasOwn(opts, 'timeout') ? opts.timeout : TIMEOUT)
          await Promise.race([fn(assert), assert[kTimedout], assert])
          await Promise.allSettled(assert[kChildren].map((child) => child[kDone]))
        } catch (err) {
          assert[kError](err)
        }
        await Promise.allSettled(assert[kChildren])
        if (assert.planned === 0) queueMicrotask(() => assert.end())
        try { if (assert.done === false) await assert[kDone] } catch {}
      })
      return promise.then(() => assert)
    }
    test.skip = this.skip.bind(this)
    test.todo = this.todo.bind(this)
    test.configure = this.configure.bind(this)
    Object.defineProperty(this, 'test', { value: test.bind(this) })

    test.test = this.test

    return this.test
  }

  solo (description, opts = {}, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }
    this[kSolo] = true
    opts[kSolo] = true

    if (arguments.length > 0) return this.test(description, opts, fn)
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
    const idx = this[kIndex]++
    this.planned = planned
    await this.tap.step({ type: 'plan', planned, comment, idx })
  }

  async pass (message = 'passed') {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'pass'
    const ok = true
    const count = this.count
    const explanation = null
    this.passing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async fail (message = 'failed') {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'fail'
    const ok = false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.fail)
    this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async ok (assertion, message = 'expected truthy value') {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'ok'
    const ok = assertion
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.ok, assertion, true)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async absent (assertion, message = 'expected falsey value') {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'absent'
    const ok = !assertion
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.absent, assertion, false)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async is (actual, expected, message = 'should be equal', strict = true) {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'is'
    const ok = strict ? actual === expected : actual == expected // eslint-disable-line
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.is, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async not (actual, expected, message = 'should not be equal', strict = true) {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'not'
    const ok = strict ? actual !== expected : actual != expected // eslint-disable-line
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.not, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async alike (actual, expected, message = 'should deep equal', strict = true) {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'alike'
    const ok = deepEqual(actual, expected, { strict })
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.alike, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async unlike (actual, expected, message = 'should not deep equal', strict = true) {
    this[kIncre]()
    const idx = this[kIndex]++
    const type = 'assert'
    const assert = 'unlike'
    const ok = deepEqual(actual, expected, { strict }) === false
    const count = this.count
    const explanation = explain(ok, message, assert, Test.prototype.unlike, actual, expected)
    if (ok) this.passing += 1
    else this.failing += 1
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async exception (functionOrPromise, expectedError, message, natives = false) {
    async function exception (functionOrPromise, expectedError, message, natives = false) {
      this[kIncre]()
      const idx = this[kIndex]++
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
      let actual = false
      try {
        if (typeof functionOrPromise === 'function') functionOrPromise = functionOrPromise()
        syncThrew = false
        if (functionOrPromise instanceof Promise && pristineMessage) message = 'should reject'
        await functionOrPromise
        ok = false
      } catch (err) {
        if (syncThrew) await null // tick
        const native = natives === false && (err instanceof SyntaxError ||
        err instanceof ReferenceError ||
        err instanceof TypeError ||
        err instanceof EvalError ||
        err instanceof RangeError)
        if (native) {
          ok = false
          actual = err
        } else {
          if (!expectedError) {
            ok = true
          } else {
            ok = tmatch(err, expectedError)
          }
        }
      }
      if (ok) this.passing += 1
      else this.failing += 1
      const explanation = explain(ok, message, assert, Test.prototype.exception, actual, expectedError, top)
      await this.tap.step({ type, assert, ok, message, count, explanation, idx })
      return ok
    }

    return this[kAssertQ].add(Object.assign(exception.bind(this, functionOrPromise, expectedError, message, natives)))
  }

  async execution (functionOrPromise, message) {
    async function execution (functionOrPromise, message) {
      this[kIncre]()
      const idx = this[kIndex]++
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
      await this.tap.step({ type, assert, ok, message, count, explanation, idx })
      return ok
    }

    return this[kAssertQ].add(execution.bind(this, functionOrPromise, message))
  }

  async snapshot (actual, message = 'should match snapshot') {
    this[kIncre]()
    const idx = this[kIndex]++
    if (actual === undefined) actual = `<${actual}>`
    if (typeof actual === 'symbol') actual = `<${actual.toString()}>`
    if (actual instanceof Error) {
      actual = serializeError(actual)
      delete actual.stack
    }
    const top = originFrame(Test.prototype.snapshot)
    let file = top.getFileName().replace(/\?.+/, '')
    try { file = fileURLToPath(file) } catch {}
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
    BigInt.prototype.toJSON = function () { return this.toString() } // eslint-disable-line
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
      BigInt.prototype.toJSON = toJSON // eslint-disable-line
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
    await this.tap.step({ type, assert, ok, message, count, explanation, idx })
    return ok
  }

  async comment (message) {
    const idx = this[kIndex]++
    if (this.ended) {
      this[kError](new TestError('ERR_COMMENT_AFTER_END', { description: this.description, comment: message }))
      return
    }
    await this.tap.step({ type: 'comment', comment: message, idx })
  }

  async [kInject] (message) {
    const idx = this[kIndex]++
    await this.tap.step({ type: 'comment', comment: message, idx, raw: true })
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
      [kTimedout]: {
        configurable: true,
        writable: true,
        value: new class extends Promise {
          static get [Symbol.species] () { return Promise }
          constructor () {
            let clear = null
            let timedout = null
            super((resolve, reject) => {
              clear = resolve
              timedout = reject
            })
            this.clear = clear
            this.timedout = timedout
          }
        }()
      },
      [kTimeout]: {
        configurable: true,
        writable: true,
        value: setTimeout(() => {
          this[kTimedout].timedout(new TestError('ERR_TIMEOUT', { ms }))

          this[kTimedout] = null
        }, ms)
      }
    })
    this[kTimedout].catch((err) => { this[kError](err) })
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
      file: top.getFileName()?.replace(/\?cacheBust=\d+/g, '')
    }
    try {
      let file = err.at.file
      try { file = fileURLToPath(new URL(err.at.file, 'file:')) } catch {}
      const code = readFileSync(file, { encoding: 'utf-8' })
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
  constructor ({ concurrency = Infinity } = {}) {
    super()
    this.concurrency = concurrency
    this.pending = 0
    this.jobs = []
    // queueMicrotask()
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
        try {
          await fn()
          resolve()
        } catch (err) {
          reject(err)
        } finally {
          this.pending--
          this.next()
        }
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
    let drained = false
    while (this.next()) { drained = true } // eslint-disable-line
    return drained
  }
}

const main = new Test(kMain)
if (SOLO) main.solo()
module.exports = main.test.bind(main)
module.exports.skip = main.skip.bind(main)
module.exports.solo = main.solo.bind(main)
module.exports.todo = main.todo.bind(main)
module.exports.configure = main.configure.bind(main)
module.exports.test = module.exports
module.exports[kMain] = main
