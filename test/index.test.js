import { fileURLToPath } from 'url'
import { dirname, join, resolve, sep } from 'path'
import { promisify } from 'util'
import { spawn } from 'child_process'
import { test } from 'tap'
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
    .replace(/.+\ at (node:)?internal\/.+\n/gm, '') // remove node call frames
    .replace(/.+\(((?!\/).+)\)\n/gm, '') // remove node call frames
    .replace(/:\d+:\d+/g, ':13:37') // generalize column:linenumber 
}
const run = promisify(async (testPath, cb) => {
  const sp = spawn(process.execPath, [join(fixtures, testPath)], { stdio: ['pipe', 'pipe', 'pipe'] })
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

test('classic pass', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('classic-pass.js')
  equal(result.code, 0)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('classic fail', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('classic-fail.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('classic assertions', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('classic-assertions.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('inverted pass', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('inverted-pass.js')
  equal(result.code, 0)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('inverted fail', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('inverted-fail.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('inverted assertions', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('inverted-assertions.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('nesting', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('nesting.js')
  equal(result.code, 0)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('teardown', async ({ matchSnapshot, ok, equal }) => {
  const result = await run('teardown.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('timeout', async ({ matchSnapshot, ok, equal }) => {
  const result = await run('timeout.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('comment', async ({ matchSnapshot, ok, equal }) => {
  const result = await run('comment.js')
  equal(result.code, 0)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('tappable errors', async ({ matchSnapshot, ok, equal }) => {
  const result = await run('tappable-errors.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('skip', async ({ matchSnapshot, ok, equal }) => {
  const result = await run('skip.js')
  equal(result.code, 0)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('todo', async ({ matchSnapshot, ok, equal }) => {
  const result = await run('todo.js')
  equal(result.code, 0)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
})

test('classic after end assert', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('classic-after-end-assert.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
  matchSnapshot(result.stderr)
})

test('classic after end teardown', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('classic-after-end-teardown.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
  matchSnapshot(result.stderr)
})

test('inverted after end assert', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('inverted-after-end-assert.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
  matchSnapshot(result.stderr)
})

test('inverted after end teardown', async function ({ matchSnapshot, ok, equal }) {
  const result = await run('inverted-after-end-teardown.js')
  equal(result.code, 1)
  ok(valid(result), 'valid tap output')
  matchSnapshot(result.stdout)
  matchSnapshot(result.stderr)
})