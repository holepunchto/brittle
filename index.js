const sameObject = require('same-object')
const tmp = require('test-tmp')
const b4a = require('b4a')
const { getSnapshot, createTypedArray } = require('./lib/snapshot')
const { INDENT, RUNNER, IS_NODE, IS_BARE, DEFAULT_TIMEOUT } = require('./lib/constants')
const AssertionError = require('./lib/assertion-error')
const TracingPromise = require('./lib/tracing-promise')
const Promise = TracingPromise.Untraced // never trace internal onces

const highDefTimer = IS_NODE ? highDefTimerNode : highDefTimerFallback

// loaded on demand since it's error flow and we want ultra fast positive test runs
const lazy = {
  _errors: null,
  _tmatch: null,
  get errors () {
    if (!lazy._errors) lazy._errors = require('./lib/errors.js')
    return lazy._errors
  },
  get tmatch () {
    if (!lazy._tmatch) lazy._tmatch = require('tmatch')
    return lazy._tmatch
  }
}

class Runner {
  constructor () {
    this.tests = { count: 0, pass: 0 }
    this.assertions = { count: 0, pass: 0 }

    this.next = null
    this.solos = new Set()
    this.padded = true
    this.started = false
    this.defaultTimeout = DEFAULT_TIMEOUT
    this.bail = false
    this.unstealth = false
    this.skipAll = false
    this.explicitSolo = false
    this.source = true

    this._timer = highDefTimer()
    this._log = console.log.bind(console)
    this._paused = null
    this._resume = null

    const target = IS_NODE ? process : global.Bare
    const ondeadlock = () => {
      if (this.next && this.next._checkDeadlock === false) return
      target.off('beforeExit', ondeadlock)
      this.end()
    }

    target.on('beforeExit', ondeadlock)
  }

  resume () {
    if (!this._paused) return
    this._resume()
    this._resume = this._paused = null
  }

  pause () {
    if (this._paused) return
    this._paused = new Promise((resolve) => { this._resume = resolve })
  }

  async _wait () {
    await wait()
    await this._paused
  }

  async queue (test) {
    this.start()

    if (test._isSolo) {
      this.solos.add(test)
    }

    await this._wait()

    if (this.explicitSolo && !test._isSolo) {
      return false
    }

    if (this._shouldTest(test)) {
      while (this.next !== null) {
        const next = this.next
        await next
        if (next === this.next) this.next = null
      }

      if (test._isSkip) {
        this._skip('SKIP', test)
        return false
      }

      if (test._isTodo) {
        this._skip('TODO', test)
        return false
      }

      if (!this._shouldTest(test)) {
        return false
      }

      this.next = test
      test._header()

      if (!IS_NODE && !IS_BARE) this._autoExit(test)

      return true
    }

    return false
  }

  _skip (reason, test) {
    if (this._shouldTest(test)) {
      test._header()
      this.tests.pass++
      this.tests.count++
      this.assert(false, true, this.tests.count, '- ' + test.name + ' # ' + reason, null)
    }
  }

  _shouldTest (test) {
    return test._isHook || (!this.skipAll && (this.solos.size === 0 || this.solos.has(test)))
  }

  async _autoExit (test) {
    try {
      await test
      await wait(10) // wait 10 ticks...
      if (this.next === test) {
        this.end()
      }
    } catch {}
  }

  log (...message) {
    this._log(...message)
    this.padded = false
  }

  padding () {
    if (this.padded) return
    this.padded = true
    this.log()
  }

  start () {
    if (this.started) return
    this.started = true
    this.log('TAP version 13')
  }

  comment (...message) {
    this.log('#', ...message)
  }

  end () {
    if (this.next) {
      if (!this.next._isEnded && !(this.next._hasPlan && this.next._planned === 0)) {
        this.next._onend(prematureEnd(this.next, 'Test did not end (' + this.next.name + ')'))
        return
      }

      if (!this.next._isResolved) {
        if (this.next._isDone) {
          this.next._onend(new Error('Teardown did not end (unresolved promise)'))
          return
        }
        this.next._onend(new Error('Test appears deadlocked (unresolved promise)'))
        return
      }
    }

    if (this.bail && this.skipAll) {
      this.log('Bail out!')
    }

    this.padding()
    this.log('1..' + this.tests.count)
    this.log('# tests = ' + this.tests.pass + '/' + this.tests.count + ' pass')
    this.log('# asserts = ' + this.assertions.pass + '/' + this.assertions.count + ' pass')
    this.log('# time = ' + this._timer() + 'ms')
    this.log()

    if (this.tests.count === this.tests.pass && this.assertions.count === this.assertions.pass) this.log('# ok')
    else this.log('# not ok')
  }

  assert (indent, ok, number, message, explanation, stealth) {
    const ind = indent ? INDENT : ''

    if (ok) {
      if (!stealth || this.unstealth) this.log(ind + 'ok ' + number, message)
    } else {
      if (IS_NODE) process.exitCode = 1
      if (IS_BARE) global.Bare.exitCode = 1
      this.log(ind + 'not ok ' + number, message)
      if (explanation) this.log(lazy.errors.stringify(explanation))
      if (this.bail && !this.skipAll) this.skipAll = true
      if (!this.unstealth && stealth) throw new AssertionError({ message: 'Stealth assertion failed' })
    }
  }
}

class Test {
  constructor (name, parent, opts = {}) {
    this._resolve = null
    this._reject = null

    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })

    this._parents = []
    this._main = parent ? parent._main : this
    this._runner = getRunner()
    this.name = name
    this.passes = 0
    this.fails = 0
    this.assertions = 0

    this._isEnded = false
    this._isDone = false
    this._isHook = opts?.hook || false
    this._isSolo = opts?.solo || false
    this._isSkip = opts?.skip || false
    this._isTodo = opts?.todo || false
    this._isResolved = false
    this._isQueued = false
    this._isMain = this._main === this
    this._isStealth = opts?.stealth || parent?._isStealth || false
    this._checkDeadlock = opts?.deadlock !== false

    // allow destructuring by binding the functions
    this.comment = this._comment.bind(this)
    this.timeout = this._timeout.bind(this)
    this.teardown = this._teardown.bind(this)
    this.test = this._test.bind(this)
    this.plan = this._plan.bind(this)

    this.pass = this._pass.bind(this)
    this.fail = this._fail.bind(this)

    this.ok = this._ok.bind(this)
    this.absent = this._absent.bind(this)

    this.is = this._is.bind(this, true)
    this.is.coercively = this._is.bind(this, false)

    this.not = this._not.bind(this, true)
    this.not.coercively = this._not.bind(this, false)

    this.alike = this._alike.bind(this, true)
    this.alike.coercively = this._alike.bind(this, false)

    this.unlike = this._unlike.bind(this, true)
    this.unlike.coercively = this._unlike.bind(this, false)

    this.exception = this._exception.bind(this, false)
    this.exception.all = this._exception.bind(this, true)

    this.execution = this._execution.bind(this)

    this.stealth = this._stealth.bind(this)

    this.snapshot = this._snapshot.bind(this)

    this.end = this._end.bind(this)

    this._parent = parent
    this._first = true
    this._wait = false
    this._planned = 0
    this._hasPlan = false
    this._active = 0
    this._timer = null

    this._headerLogged = false
    this._to = null
    this._teardowns = []
    this._tickers = new Map()

    while (parent) {
      this._parents.push(parent)
      parent = parent._parent
    }
  }

  then (...args) {
    return this._promise.then(...args)
  }

  catch (...args) {
    return this._promise.catch(...args)
  }

  finally (...args) {
    return this._promise.finally(...args)
  }

  _header () {
    if (this._headerLogged) return
    this._headerLogged = true
    this._runner.start()
    this._runner.padding()
    this._runner.comment(this.name || 'test')
  }

  tmp () { return tmp(this) }

  _planDoneOrEnd () {
    return this._isEnded || (this._hasPlan && this._planned === 0)
  }

  _timeout (ms) {
    if (!ms) {
      if (this._to) clearTimeout(this._to)
      this._to = null
      return
    }

    const ontimeout = () => {
      this._to = null
      this._onend(new Error('Test timed out after ' + ms + ' ms'))
    }

    if (this._to) clearTimeout(this._to)
    this._to = setTimeout(ontimeout, ms)
    if (this._to.unref) this._to.unref()
  }

  _plan (n) {
    if (typeof n !== 'number' || n < 0) {
      throw new Error('Plan takes a positive whole number only')
    }

    this._hasPlan = true
    this._planned = n
  }

  _comment (...m) {
    if (this._isResolved) throw new Error('Can\'t comment after end')
    this._runner.log(INDENT + '#', ...m)
  }

  _message (message) {
    let m = '- '

    if (!this._isMain) {
      for (let i = this._parents.length - 2; i >= 0; i--) {
        const p = this._parents[i]
        if (!p.name) continue
        m += '(' + p.name + ') - '
      }
      if (this.name) {
        m += '(' + this.name + ') - '
      }
    }

    if (message) {
      m += message
    }

    return m
  }

  _tick (ok) {
    if (ok) this.passes++
    else this.fails++
    this.assertions++
  }

  _track (topLevel, ok) {
    if (topLevel) {
      this._runner.tests.count++
      if (ok) this._runner.tests.pass++
      return this._runner.tests.count
    }

    if (this._hasPlan) this._planned--
    this._tick(ok)

    if (!this._isMain) this._main._tick(ok)

    this._runner.assertions.count++
    if (ok) this._runner.assertions.pass++

    return this._main.assertions
  }

  _assertion (ok, message, explanation, caller, top, isStealth = this._isStealth) {
    this._runner.assert(!this._main._isResolved, ok, this._track(false, ok), this._message(message), explanation, isStealth)

    if (this._isEnded || this._isDone) {
      throw new AssertionError({ message: 'Assertion after end' })
    }

    if (this._hasPlan && this._planned < 0) {
      throw new AssertionError({ message: 'Too many assertions' })
    }

    if (this._hasPlan && this._planned === 0) {
      this._checkEnd()
    }
  }

  _fail (message = 'failed') {
    const explanation = explain(false, message, 'fail', this._fail)
    this._assertion(false, message, explanation, this._fail, undefined)
  }

  _pass (message = 'passed') {
    this._assertion(true, message, null, this._pass, undefined)
  }

  _ok (assertion, message = 'expected truthy value') {
    const ok = assertion
    const explanation = explain(ok, message, 'ok', this._ok)
    this._assertion(ok, message, explanation, this._ok, undefined)
  }

  _absent (assertion, message = 'expected falsy value') {
    const ok = !assertion
    const explanation = explain(ok, message, 'absent', this._absent)
    this._assertion(ok, message, explanation, this._absent, undefined)
  }

  _is (strict, actual, expected, message = 'should be equal') {
    const ok = strict ? actual === expected : actual == expected // eslint-disable-line
    const explanation = explain(ok, message, 'is', this._is, actual, expected)
    this._assertion(ok, message, explanation, this._is, undefined)
  }

  _not (strict, actual, expected, message = 'should not be equal') {
    const ok = strict ? actual !== expected : actual != expected // eslint-disable-line
    const explanation = explain(ok, message, 'not', this._not, actual, expected)
    this._assertion(ok, message, explanation, this._not, undefined)
  }

  _alike (strict, actual, expected, message = 'should deep equal') {
    const ok = sameObject(actual, expected, { strict })
    const explanation = explain(ok, message, 'alike', this._alike, actual, expected)
    this._assertion(ok, message, explanation, this._alike, undefined)
  }

  _unlike (strict, actual, expected, message = 'should not deep equal') {
    const ok = sameObject(actual, expected, { strict }) === false
    const explanation = explain(ok, message, 'unlike', this._unlike, actual, expected)
    this._assertion(ok, message, explanation, this._unlike, undefined)
  }

  _teardown (fn, opts = {}) {
    if (this._isDone) throw new Error('Can\'t add teardown after end')
    this._teardowns.push([opts.order || 0, !!opts.force, fn])
  }

  async _exception (natives, functionOrPromise, expectedError, message) {
    if (typeof expectedError === 'string') {
      message = expectedError
      expectedError = undefined
    }

    const top = originFrame(this._exception)
    const pristineMessage = message === undefined

    let ok = null
    let actual = false

    if (pristineMessage) message = 'should throw'

    this._active++
    try {
      if (typeof functionOrPromise === 'function') functionOrPromise = functionOrPromise()
      if (isPromise(functionOrPromise)) {
        if (pristineMessage) message = 'should reject'
        await functionOrPromise
      }
      ok = false
    } catch (err) {
      const native = natives === false && isUncaught(err)
      if (native) throw err

      if (!expectedError) {
        ok = true
      } else {
        ok = lazy.tmatch(err, expectedError)
      }

      actual = err
    } finally {
      this._active--
    }

    const explanation = explain(ok, message, 'exception', this._exception, actual, expectedError, top)
    this._assertion(ok, message, explanation, this._execution, top)
    this._checkEnd()
  }

  async _execution (functionOrPromise, message) {
    const top = originFrame(this._execution)
    const pristineMessage = message === undefined

    let ok = false
    let error = null

    if (pristineMessage) message = 'should return'

    const time = highDefTimer()

    this._active++
    try {
      if (typeof functionOrPromise === 'function') functionOrPromise = functionOrPromise()
      if (isPromise(functionOrPromise)) {
        if (pristineMessage) message = 'should resolve'
        await functionOrPromise
      }
      ok = true
    } catch (err) {
      error = err
    } finally {
      this._active--
    }

    const elapsed = time()

    const explanation = explain(ok, message, 'execution', this._execution, error, null, top)
    this._assertion(ok, message, explanation, this._execution, top)
    this._checkEnd()

    return elapsed
  }

  _stealth (name, opts, fn) {
    if (typeof name === 'function') return this.stealth(null, null, name)
    if (typeof opts === 'function') return this.stealth(name, null, opts)

    return this.test(name, { ...opts, stealth: true }, fn)
  }

  _snapshot (actual, message = 'should match snapshot') {
    const top = originFrame(this._snapshot)

    if (!top) {
      this._assertion(true, message, null, this._snapshot, undefined)
      return
    }

    if (b4a.isBuffer(actual)) {
      actual = new Uint8Array(actual.buffer, actual.byteOffset, actual.byteLength)
    }

    const filename = top.getFileName()
    const key = (this.name || '') + ' ' + this._message(message)
    const expected = getSnapshot(filename, key + ' - ' + this._getTick(key), actual)

    const ok = sameObject(actual, expected, { strict: true })
    const explanation = explain(ok, message, 'snapshot', this._snapshot, actual, expected)

    this._assertion(ok, message, explanation, this._snapshot, undefined)
  }

  _getTick (key) {
    const tick = this._tickers.get(key) || 0
    this._tickers.set(key, 1 + tick)
    return tick
  }

  _test (name, opts, fn) {
    if (typeof name === 'function') return this.test(null, null, name)
    if (typeof opts === 'function') return this.test(name, null, opts)

    const t = new Test(name, this, opts)

    if (this._hasPlan) this._planned--
    this._active++

    return fn ? t._run(fn, opts || {}) : t
  }

  async _run (fn, opts) {
    this._isQueued = true

    if (!this._parent) {
      if (!(await this._runner.queue(this))) return
    }

    this._onstart(opts)
    this._wait = true

    try {
      await fn(this)
    } catch (err) {
      if (!(err instanceof AssertionError && err.message === 'ERR_ASSERTION: Stealth assertion failed')) {
        this._wait = false
        await this._runTeardown(err)
        throw err
      }
    }

    if (!this._hasPlan) this.end()

    this._wait = false
    this._checkEnd()

    return await this
  }

  _end () {
    this._isEnded = true

    if (this._hasPlan && this._planned > 0) {
      throw prematureEnd(this, 'Too few assertions')
    }

    this._checkEnd()
  }

  _checkEnd () {
    if (this._active || this._wait) return
    if (this._isEnded || (this._hasPlan && this._planned === 0)) this._done()
  }

  _done () {
    if (this._isDone) return
    this._isDone = true

    if (this._teardowns.length) {
      this._teardowns.sort(cmp)
      this._runTeardown(null)
    } else {
      this._onend(null)
    }

    if (this._parent) {
      const p = this._parent

      this._parent._active--
      this._parent = null

      p._checkEnd()
    }
  }

  async _runTeardown (error) {
    const forced = !!error

    let fired = false

    const t = setTimeout(() => {
      fired = true
      this.comment('...teardown still running after 250ms')
    }, 250)

    if (t.unref) t.unref()

    const time = highDefTimer()

    for (const [, force, teardown] of this._teardowns) {
      try {
        if (force || !forced) await teardown()
      } catch (err) {
        if (!error) error = err
      }
    }

    clearTimeout(t)
    if (fired) this.comment('...teardown time ' + time() + 'ms')
    this._onend(error)
  }

  _onstart (opts) {
    const to = this._isMain
      ? (opts && opts.timeout !== undefined) ? opts.timeout : this._runner.defaultTimeout // main tests need a default timeout, unless opt-out
      : opts && opts.timeout // non main ones do not

    if (this._isMain) {
      if (!this._isQueued) {
        if (this._runner.next) throw new Error('Only run test can be running at the same time')
        this._runner.next = this
      }
      this._header()
      this._timer = highDefTimer()
    }

    if (to) this._timeout(to)
  }

  _onend (err) {
    if (this._isResolved) return

    this._timeout(0) // just to be sure incase someone ran this during teardown...

    const ok = (this.fails === 0)

    if (this._isMain && !err) {
      const time = this._timer ? ' # time = ' + this._timer() + 'ms' : ''
      this._runner.assert(false, ok, this._track(true, ok), '- ' + (this.name || '') + time, null)
    }

    this._isResolved = true
    this._isDone = true

    if (this._isMain && this._runner.next === this) {
      this._runner.next = null
    }

    if (err) this._reject(err)
    else this._resolve(ok)

    // if test is running without deadlock detection, trigger "io" to rerun it in case idle now
    if (this._checkDeadlock === false) setImmediate(() => {})
  }
}

exports = module.exports = test

exports.Test = Test
exports.test = test
exports.hook = hook
exports.solo = solo
exports.skip = skip
exports.todo = todo
exports.configure = configure
exports.pause = pause
exports.resume = resume
exports.stealth = stealth

// Used by snapshots
exports.createTypedArray = createTypedArray

function configure ({ timeout = DEFAULT_TIMEOUT, bail = false, solo = false, unstealth = false, source = true, coverage = false } = {}) {
  const runner = getRunner()

  if (runner.tests.count > 0 || runner.assertions.count > 0) {
    throw new Error('Configuration must happen prior to registering any tests')
  }

  if (coverage) require('bare-cov')({ dir: typeof coverage === 'string' ? coverage : undefined })

  runner.defaultTimeout = timeout
  runner.bail = bail
  runner.explicitSolo = solo
  runner.unstealth = unstealth
  runner.source = source
}

function highDefTimerNode () {
  const then = process.hrtime.bigint()
  return function () {
    const now = process.hrtime.bigint()
    return Number(now - then) / 1e6
  }
}

function highDefTimerFallback () {
  const then = Date.now()
  return function () {
    const now = Date.now()
    return now - then
  }
}

function cmp (a, b) {
  return a[0] - b[0]
}

function test (name, opts, fn, overrides) {
  if (typeof name === 'function') return test(null, null, name, overrides)
  if (typeof opts === 'function') return test(name, null, opts, overrides)

  opts = { ...opts, ...overrides }

  const t = new Test(name, null, opts)

  if (fn) return t._run(fn, opts)
  if (t._isTodo) return t._run(() => {}, opts)

  if (t._isSkip) {
    throw new Error('An inverted test cannot be skipped')
  }
  if (t._isSolo) {
    t._runner.solo = t
  }

  t._onstart(opts)

  return t
}

function hook (name, opts, fn) {
  return test(name, opts, fn, { hook: true })
}

function solo (name, opts, fn) {
  if (!name && !opts && !fn) return test.configure({ solo: true })
  return test(name, opts, fn, { solo: true })
}

function skip (name, opts, fn) {
  return test(name, opts, fn, { skip: true })
}

function todo (name, opts, fn) {
  return test(name, opts, fn, { todo: true })
}

function pause () {
  getRunner().pause()
}

function resume () {
  getRunner().resume()
}

function wait (ticks = 1) {
  return new Promise(resolve => {
    tickish(function loop () {
      if (--ticks <= 0) return resolve()
      tickish(loop)
    })
  })
}

function tickish (fn) {
  if (IS_NODE) { // do both types of tick in node to flush both queues
    process.nextTick(queueMicrotask, fn)
  } else {
    queueMicrotask(fn)
  }
}

function explain (ok, message, assert, stackStartFunction, actual, expected, top = !ok && originFrame(stackStartFunction), extra) {
  const runner = getRunner()
  return ok ? null : lazy.errors.explain(ok, message, assert, stackStartFunction, actual, expected, runner.source ? top : null, extra)
}

function originFrame (stackStartFunction) {
  if (!Error.captureStackTrace) return undefined
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

function isPromise (p) {
  return !!(p && typeof p.then === 'function')
}

function isUncaught (err) {
  return err instanceof SyntaxError ||
    err instanceof ReferenceError ||
    err instanceof TypeError ||
    err instanceof EvalError ||
    err instanceof RangeError
}

function getRunner () {
  if (!global[RUNNER]) global[RUNNER] = new Runner()
  return global[RUNNER]
}

function prematureEnd (t, message) {
  const details = t._hasPlan
    ? ' [assertion count (' + t.assertions + ') did not reach plan (' + (t.assertions + t._planned) + ')]'
    : ''

  return new Error(message + details)
}

function stealth (name, opts, fn) {
  return test(name, opts, fn, { stealth: true })
}
