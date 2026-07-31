import assert from 'assert'
import fs from 'fs'
import path from 'path'
import process from 'process'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import {
  decodeKeys,
  selectFiles,
  summaryLine,
  parseTally,
  toPattern,
  nothingToRun
} from '../lib/watch.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.join(__dirname, '..')

// bare-assert has no deepStrictEqual or match, so compare shapes as JSON and
// regexes explicitly
function same(actual, expected, message) {
  assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected), message)
}

function matches(text, regex, message) {
  assert.ok(regex.test(text), (message ?? 'expected ' + regex) + '\n---\n' + text + '\n---')
}

// decodeKeys turns raw terminal bytes into named keys

{
  same(decodeKeys('a'), [{ name: 'a', ctrl: false }])
  same(decodeKeys('\r'), [{ name: 'return', ctrl: false }])
  same(decodeKeys('\n'), [{ name: 'return', ctrl: false }])
  same(decodeKeys('\x7f'), [{ name: 'backspace', ctrl: false }])
  same(decodeKeys('\x03'), [{ name: 'c', ctrl: true }])
  same(decodeKeys('\x1b'), [{ name: 'escape', ctrl: false }])

  // a whole paste is decoded in order
  same(decodeKeys('ab\r'), [
    { name: 'a', ctrl: false },
    { name: 'b', ctrl: false },
    { name: 'return', ctrl: false }
  ])

  // arrow keys are swallowed rather than read as the letters in their sequence
  same(decodeKeys('\x1b[A'), [{ name: 'unknown', ctrl: false }])
  same(decodeKeys('\x1bOB'), [{ name: 'unknown', ctrl: false }])
  same(decodeKeys('\x1b[Aq'), [
    { name: 'unknown', ctrl: false },
    { name: 'q', ctrl: false }
  ])
}

// selectFiles applies the mode and the pattern

{
  const files = ['test/a.js', 'test/b.js', 'test/c.js']
  const base = { failed: new Set(['test/b.js']), changed: new Set(['test/c.js']) }

  same(selectFiles({ ...base, mode: 'all', pattern: null }, files), files)
  same(selectFiles({ ...base, mode: 'failed', pattern: null }, files), ['test/b.js'])
  same(selectFiles({ ...base, mode: 'changed', pattern: null }, files), ['test/c.js'])
  same(selectFiles({ ...base, mode: 'all', pattern: /[ac]\.js/ }, files), [
    'test/a.js',
    'test/c.js'
  ])

  // mode and pattern compose
  same(selectFiles({ ...base, mode: 'failed', pattern: /a\.js/ }, files), [])

  // a cleared pattern is not applied
  same(selectFiles({ ...base, mode: 'all', pattern: false }, files), files)
}

// toPattern

{
  assert.strictEqual(toPattern(''), false, 'empty input clears the filter')
  assert.ok(toPattern('nest') instanceof RegExp)
  assert.strictEqual(toPattern('nest').source, 'nest')
  assert.strictEqual(toPattern('a['), null, 'an invalid regex is rejected')
}

// parseTally reads the runner's own summary comments

{
  same(parseTally('# tests = 4/5 pass'), { kind: 'tests', pass: 4, count: 5 })
  same(parseTally('# asserts = 0/1 pass'), { kind: 'asserts', pass: 0, count: 1 })
  assert.strictEqual(parseTally('# time = 5ms'), null)
  assert.strictEqual(parseTally('ok 1 - passing'), null)
  assert.strictEqual(parseTally('# tests = 4/5'), null)
}

// summaryLine only mentions failures when there are some

{
  assert.strictEqual(
    summaryLine('Files', { failed: 0, passed: 2, total: 2 }),
    'Files:   2 passed, 2 total'
  )
  assert.strictEqual(
    summaryLine('Asserts', { failed: 1, passed: 3, total: 4 }),
    'Asserts: 1 failed, 3 passed, 4 total'
  )
}

// nothingToRun explains why the selection is empty

{
  matches(nothingToRun({ mode: 'failed', pattern: null }), /No failed files/)
  matches(nothingToRun({ mode: 'changed', pattern: null }), /have changed/)
  matches(nothingToRun({ mode: 'all', pattern: /nope/ }), /match \/nope\//)
  matches(nothingToRun({ mode: 'all', pattern: null }), /No test files to run/)
}

// end to end: the watcher runs everything, reports per file, then reruns on a change

{
  const dir = path.join(__dirname, `_watch-${Math.random().toString(16).slice(2)}`)
  const relative = path.relative(root, dir)
  const passing = path.join(dir, 'passing.js')
  const failing = path.join(dir, 'failing.js')

  fs.mkdirSync(dir)

  try {
    write(passing, "test('alpha', (t) => { t.plan(1); t.pass('a ok') })")
    write(failing, "test('beta', (t) => { t.plan(1); t.fail('b broken') })")

    const run = start([`${relative}/*.js`])

    try {
      await run.waitFor('Watching')

      matches(run.output(), / PASS {2}\S*passing\.js/, 'the passing file is reported')
      matches(run.output(), / FAIL {2}\S*failing\.js/, 'the failing file is reported')
      matches(run.output(), /Files: {3}1 failed, 1 passed, 2 total/)
      matches(run.output(), /Tests: {3}1 failed, 1 passed, 2 total/)
      matches(run.output(), /Asserts: 1 failed, 1 passed, 2 total/)
      matches(run.output(), /Failed files:\n\s+- \S*failing\.js/)
      assert.ok(!run.output().includes('\x1b['), 'a piped watcher does not colorize')

      run.clear()
      write(failing, "test('beta', (t) => { t.plan(1); t.pass('fixed') })")

      await run.waitFor('Watching')

      matches(run.output(), /brittle watch — \S*failing\.js changed/, 'the change is reported')
      matches(run.output(), /Files: {3}2 passed, 2 total/, 'the rerun passes')
      assert.ok(!run.output().includes('FAIL'), 'nothing fails after the fix')
      assert.ok(!run.output().includes('Failed files:'), 'the failed list is gone')
    } finally {
      run.kill()
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function write(file, body) {
  fs.writeFileSync(file, `const test = require(${JSON.stringify(root)})\n\n${body}\n`, 'utf-8')
}

function start(args) {
  const child = spawn(process.execPath, [path.join(root, 'cmd.js'), '--watch', ...args], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe']
  })

  let buffer = ''
  let stderr = ''

  child.stdout.setEncoding('utf-8')
  child.stderr.setEncoding('utf-8')
  child.stdout.on('data', (data) => {
    buffer += data
  })
  child.stderr.on('data', (data) => {
    stderr += data
  })

  return {
    output: () => buffer,
    clear: () => {
      buffer = ''
    },
    kill: () => child.kill(),
    async waitFor(marker, timeout = 30000) {
      const deadline = Date.now() + timeout

      while (Date.now() < deadline) {
        if (buffer.includes(marker)) return
        await sleep(50)
      }

      throw new Error(
        `timed out waiting for ${JSON.stringify(marker)}\n[stdout]\n${buffer}\n[stderr]\n${stderr}`
      )
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
