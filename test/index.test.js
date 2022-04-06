import { rm } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join, resolve, sep } from 'path'
import { once } from 'events'
import { spawn } from 'child_process'
import { test, configure } from '../index.js'
import Parser from 'tap-parser'

configure({concurrent: true})
const testDir = fileURLToPath(dirname(import.meta.url))
const ciCompat = join(testDir, 'ci-compat.cjs')
const fixtures = join(testDir, 'fixtures')
const fixturesRx = new RegExp(fixtures, 'g')
const dirRx = new RegExp(resolve(testDir, '..') + sep, 'g')

const clean = (str, opts = {}) => {
  if (!opts.dirtyTime) str = str.replace(/(time=).*(ms)/g, '$11.3371337$2') // generalize timestamps
  return str
    .replace(fixturesRx, '') // remove fixture call frames
    .replace(dirRx, '') // remove project dir occurrences
    .replace(/.+\(internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\ at.+(node:)?internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\(((?!\/).+:.+:.+)\)\n/gm, '') // remove node call frames
    .replace(/:\d+:\d+/g, ':13:37') // generalize column:linenumber 
    .replace(/.+\ at async .+\n/gm, '') // remove async frames
}
const run = (testPath, cb) => {
  let opts = {}
  if (typeof testPath === 'object') {
    opts = testPath
    testPath = opts.test
  }
  const sp = spawn(process.execPath, ['-r', ciCompat, join(fixtures, testPath)], { stdio: ['pipe', 'pipe', 'pipe'], ...opts })
  const stdout = []
  const stderr = []
  sp.stdout.setEncoding('utf-8')
  sp.stderr.setEncoding('utf-8')
  sp.stdout.on('data', (chunk) => stdout.push(chunk))
  sp.stderr.on('data', (chunk) => stderr.push(chunk))
  sp.stdout.on('end', (chunk) => { if (chunk) stdout.push(chunk) })
  sp.stderr.on('end', (chunk) => { if (chunk) stderr.push(chunk) })
  const promise = new Promise((resolve) => {
    sp.on('close', (code) => {
      const out = clean(stdout.join(''), opts)
      resolve({ stdout: out, stderr: clean(stderr.join(''), opts), code, [Symbol.toPrimitive] () { return out } })
    })
  })
  promise.sp = sp
  return promise
}
const valid = (tap, returnParsed = false) => {
  try {
    const result = Parser.parse(tap, {
      bail: false,
      preserveWhitespace: true,
      omitVersion: false,
      strict: true,
      flat: false
    })

    for (const [type] of result) {
      if (type === 'extra') return console.log(result) || returnParsed ? { isValid: false, parsed: result } : false
    }
    return returnParsed ? { isValid: true, parsed: result } : true
  } catch (err) {
    return returnParsed ? { isValid: false, parsed: null } : false
  }
}

test('classic pass', async function ({ snapshot, ok, is }) {
  const result = await run('classic-pass.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('classic fail', async function ({ snapshot, ok, is }) {
  const result = await run('classic-fail.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('classic assertions', async function ({ snapshot, ok, is }) {
  const result = await run('classic-assertions.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('inverted pass', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-pass.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('inverted fail', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-fail.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('inverted assertions', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-assertions.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('nesting', async function ({ snapshot, ok, is }) {
  const result = await run('nesting.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('teardown', async ({ snapshot, ok, is }) => {
  const result = await run('teardown.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('teardown behaviour', async ({ snapshot, ok, is }) => {
  const result = await run('teardown-behaviour.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('timeout', async ({ snapshot, ok, is }) => {
  const result = await run('timeout.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('comment', async ({ snapshot, ok, is }) => {
  const result = await run('comment.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('comment after end', async ({ snapshot, ok, is }) => {
  const result = await run('comment-after-end.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

await test('spacer', async ({ pass }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  pass('spacing')
})

await test('tappable errors', async ({ snapshot, ok, is }) => {
  const result = await run('tappable-errors.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

await test('spacer', async ({ pass }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  pass('spacing')
})

test('skip', async ({ snapshot, ok, is }) => {
  const result = await run('skip.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('todo', async ({ snapshot, ok, is }) => {
  const result = await run('todo.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('solo', async ({ snapshot, ok, is }) => {
  const result = await run({
    test: 'solo.js',
    env: { SOLO: 1 }
  })
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('solo (manual opt-in)', async ({ snapshot, ok, is }) => {
  const result = await run('solo-manual-opt-in.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('default description', async function ({ snapshot, ok, is }) {
  const result = await run('default-description.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('sync functions allowed', async function ({ snapshot, ok, is }) {
  const result = await run('sync-functions-allowed.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('configure output stream', async function ({ snapshot, ok, is }) {
  const result = await run('configure-output-stream.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  is(result.stdout, '')
  snapshot(result.stderr)
})

test('configure output fd', async function ({ snapshot, ok, is }) {
  const result = await run('configure-output-fd.js')
  is(result.code, 0)
  ok(valid(result), 'valid tap output')
  is(result.stdout, '')
  snapshot(result.stderr)
})

test('classic configure first', async function ({ snapshot, ok, is }) {
  const result = await run('classic-configure-first.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('classic plan must be integer', async function ({ snapshot, ok, is }) {
  const result = await run('classic-plan-must-be-integer.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('classic plan must be positive', async function ({ snapshot, ok, is }) {
  const result = await run('classic-plan-must-be-positive.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('classic after end assert', async function ({ snapshot, ok, is }) {
  const result = await run('classic-after-end-assert.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr.replace(/{|}/g, ''))
})

test('classic after end count exceeds plan', async function ({ snapshot, ok, is }) {
  const result = await run('classic-after-end-count-exceeds-plan.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr.replace(/{|}/g, ''))
})

test('classic after end teardown', async function ({ snapshot, ok, is }) {
  const result = await run('classic-after-end-teardown.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr.replace(/{|}/g, ''))
})

test('inverted configure first', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-configure-first.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('inverted plan must be integer', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-plan-must-be-integer.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('inverted plan must be positive', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-plan-must-be-positive.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('inverted after end assert', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-after-end-assert.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('inverted after end count exceeds plan', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-after-end-count-exceeds-plan.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('inverted after end teardown', async function ({ snapshot, ok, is }) {
  const result = await run('inverted-after-end-teardown.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('adjacency', async function ({ snapshot, ok, is }) {
  const result = await run('adjacency.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('exception.all', async function ({ snapshot, ok, is }) {
  const result = await run('exception-all.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

await test('snapshot', async function ({ snapshot, ok, is, teardown }) {
  const cwd = process.cwd()
  process.chdir(testDir)
  const snapshots = resolve(testDir, '__snapshots__')
  teardown(async () => { 
    await rm(snapshots, { recursive: true }) 
    process.chdir(cwd)
  })
  await rm(snapshots, { recursive: true, force: true })
  
  {
    // snapshot create:
    const result = await run({test: 'snapshot.js', env: { TEST_VALUE: '123' }})
    is(result.code, 0)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
  {
    // snapshot pass:
    const result = await run({test: 'snapshot.js', env: { TEST_VALUE: '123' }})
    is(result.code, 0)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
  {
    // snapshot fail:
    const result = await run({test: 'snapshot.js', env: { TEST_VALUE: '321' }})
    is(result.code, 1)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
  {
    // snapshot update:
    const result = await run({test: 'snapshot.js', env: { SNAP: '1', TEST_VALUE: '321' }})
    is(result.code, 0)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
  {
    // snapshot pass with new value
    const result = await run({test: 'snapshot.js', env: { TEST_VALUE: '321' }})
    is(result.code, 0)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
  {
    // snapshot fail with old value:
    const result = await run({test: 'snapshot.js', env: { TEST_VALUE: '123' }})
    is(result.code, 1)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
})

test('self bail', async function ({ snapshot, ok, is }) {
  const result = await run('self-bail.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('extraneous error propagation', async function ({ snapshot, ok, is }) {
  {
    const result = await run('extraneous-error-propagation.js')
    is(result.code, 1)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
  {
    const result = await run('extraneous-error-propagation.cjs')
    is(result.code, 1)
    ok(valid(result), 'valid tap output')
    snapshot(result.stdout)
  }
})

test('serial', async function ({ ok, is }) {
  const result = await run({ test: 'serial.js', dirtyTime: true })
  is(result.code, 0)
  const { isValid, parsed } = valid(result, true)
  ok(isValid, 'valid tap output')
  const sum = Math.round(
    parsed
      .filter(([type]) => type === 'assert')
      .map(([, { time }]) => time)
      .reduce((sum, n) => sum + n) / 100
  ) * 100
  const time = Math.round(parsed[parsed.length -1][1].time / 100) * 100
  is(sum, time)
})

test('concurrency: 2', async function ({ ok, is }) {
  const result = await run({ test: 'concurrency-2.js', dirtyTime: true })
  is(result.code, 0)
  const { isValid, parsed } = valid(result, true)
  ok(isValid, 'valid tap output')
  const times = parsed.filter(([type]) => type === 'assert').map(([, { time }]) => time)
  const sum =  Math.round((Math.max(...times.slice(0, 1)) + times[2]) / 100) * 100
  const time = Math.round(parsed[parsed.length -1][1].time / 100) * 100
  is(sum, time)
})

test('concurrent: true (-> concurrency: 5)', async function ({ ok, is }) {
  const result = await run({ test: 'concurrent.js', dirtyTime: true })
  is(result.code, 0)
  const { isValid, parsed } = valid(result, true)
  ok(isValid, 'valid tap output')
  const times = parsed.filter(([type]) => type === 'assert').map(([, { time }]) => time)
  const sum =  Math.round((Math.max(...times)) / 100) * 100
  const time = Math.round(parsed[parsed.length -1][1].time / 100) * 100
  is(sum, time)
})

test('concurrency: true (-> concurrency: 5)', async function ({ ok, is }) {
  const result = await run({ test: 'concurrency-true.js', dirtyTime: true })
  is(result.code, 0)
  const { isValid, parsed } = valid(result, true)
  ok(isValid, 'valid tap output')
  const times = parsed.filter(([type]) => type === 'assert').map(([, { time }]) => time)
  const sum =  Math.round((Math.max(...times)) / 100) * 100
  const time = Math.round(parsed[parsed.length -1][1].time / 100) * 100
  is(sum, time)
})

test('multitick execution/exception', async function ({ snapshot, ok, is }) {
  const result = await run('multitick-execution-exception.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('timeout failure cascade avoidance', async function ({ snapshot, ok, is }) {
  const result = await run('timeout-failure-cascade.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('no active handles unplanned unending', async function ({ snapshot, ok, is }) {
  const result = await run('no-handles-unending.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
})

test('active handles report', async function ({ ok, is }) {
  const result = await run({
    test: 'active-handles-report.js',
    env: {...process.env, TEST_EMULATE_SIGINT: 100 }
  })

  is(result.code, 127)
  ok(valid(result), 'valid tap output')
  ok(result.stdout.includes('# Active Handles Report'))
})

// leave this test at the end:
test('type declarations', async function ({ alike }) {
  const { default: { default: tsd }} = await import('tsd')
  const diagnostics = await tsd()
  alike(diagnostics, [])
})
