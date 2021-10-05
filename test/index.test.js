import { rm } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join, resolve, sep } from 'path'
import { promisify } from 'util'
import { spawn } from 'child_process'
import { test } from '../index.js'
import Parser from 'tap-parser'
const testDir = fileURLToPath(dirname(import.meta.url))
const fixtures = join(testDir, 'fixtures')
const fixturesRx = new RegExp(fixtures, 'g')
const dirRx = new RegExp(resolve(testDir, '..') + sep, 'g')

const clean = (str) => {
  return str
    .replace(/(time=).*(ms)/g, '$11.3371337$2') // generalize timestamps
    .replace(fixturesRx, '') // remove fixture call frames
    .replace(dirRx, '') // remove project dir occurrences
    .replace(/.+\(internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\ at.+(node:)?internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\(((?!\/).+)\)\n/gm, '') // remove node call frames
    .replace(/:\d+:\d+/g, ':13:37') // generalize column:linenumber 
}
const run = promisify(async (testPath, cb) => {
  let opts = {}
  if (typeof testPath === 'object') {
    opts = testPath
    testPath = opts.test
  }
  const sp = spawn(process.execPath, [join(fixtures, testPath)], { stdio: ['pipe', 'pipe', 'pipe'], ...opts })
  const stdout = []
  const stderr = []
  sp.stdout.setEncoding('utf-8')
  sp.stderr.setEncoding('utf-8')
  sp.stdout.on('data', (chunk) => stdout.push(chunk))
  sp.stderr.on('data', (chunk) => stderr.push(chunk))
  sp.stdout.on('end', (chunk) => { if (chunk) stdout.push(chunk) })
  sp.stderr.on('end', (chunk) => { if (chunk) stderr.push(chunk) })
  sp.on('close', (code) => {
    const out = clean(stdout.join(''))
    cb(null, { stdout: out, stderr: clean(stderr.join('')), code, [Symbol.toPrimitive] () { return out } })
  })
})
const valid = (tap) => {
  try {
    const result = Parser.parse(tap, {
      bail: false,
      preserveWhitespace: true,
      omitVersion: false,
      strict: true,
      flat: false
    })
    for (const [type] of result) {
      if (type === 'extra') return false
    }
    return true
  } catch (err) {
    return false
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

test('tappable errors', async ({ snapshot, ok, is }) => {
  const result = await run('tappable-errors.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
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
  snapshot(result.stderr)
})

test('classic after end count exceeds plan', async function ({ snapshot, ok, is }) {
  const result = await run('classic-after-end-count-exceeds-plan.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
})

test('classic after end teardown', async function ({ snapshot, ok, is }) {
  const result = await run('classic-after-end-teardown.js')
  is(result.code, 1)
  ok(valid(result), 'valid tap output')
  snapshot(result.stdout)
  snapshot(result.stderr)
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