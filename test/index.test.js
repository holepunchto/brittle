import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { promisify } from 'util'
import { spawn } from 'child_process'
import { test } from 'tap'
import Parser from 'tap-parser'

const fixtures = join(fileURLToPath(dirname(import.meta.url)), 'fixtures')
const fixturesRx = new RegExp(fixtures, 'g')
const clean = (str) => {
  return str.replace(/(time=).*(ms)/g, '$11.3371337$2').replace(fixturesRx, '')
}
const run = promisify(async (testPath, cb) => {
  const sp = spawn(process.execPath, [join(fixtures, testPath)], { stdio: ['pipe', 'pipe', 'pipe'] })
  const stdout = []
  const stderr = []
  sp.stdout.setEncoding('utf-8')
  sp.stderr.setEncoding('utf-8')
  sp.stdout.on('data', (chunk) => stdout.push(chunk))
  sp.stderr.on('data', (chunk) => stderr.push(chunk))
  sp.on('close', (code) => {
    const out = clean(stdout.join(''))
    cb(null, { stdout: out, stderr: clean(stderr.join('')), code, [Symbol.toPrimitive] () { return out } })
  })
})
const valid = (tap) => {
  try {
    const result = Parser.parse(tap, { strict: true })
    for (const [type] of result) {
      if (type === 'extra') return false
    }
    return true
  } catch {
    return false
  }
}

test('classic pass', async function ({ matchSnapshot, ok }) {
  const result = await run('classic-pass.js')
  ok(valid(result), 'valid tap output')
  matchSnapshot(result)
})

test('classic fail', async function ({ matchSnapshot, ok }) {
  const result = await run('classic-fail.js')
  ok(valid(result), 'valid tap output')
  matchSnapshot(result)
})

// test('classic assertions', async function ({ matchSnapshot, ok }) {
//   const result = await run('classic-assertions.js')
//   ok(valid(result), 'valid tap output')
//   matchSnapshot(result)
// })

// test('inverted pass', async function ({ matchSnapshot, ok }) {
//   const result = await run('inverted-pass.js')
//   ok(valid(result), 'valid tap output')
//   matchSnapshot(result)
// })

// test('inverted fail', async function ({ matchSnapshot, ok }) {
//   const result = await run('inverted-fail.js')
//   ok(valid(result), 'valid tap output')
//   matchSnapshot(result)
// })

// test('inverted assertions', async function ({ matchSnapshot, ok }) {
//   const result = await run('inverted-assertions.js')
//   ok(valid(result), 'valid tap output')
//   matchSnapshot(result)
// })

// test('tappable errors', async ({ matchSnapshot, ok }) => {
//   const result = await run('tappable-errors.js')
//   ok(valid(result), 'valid tap output')
//   matchSnapshot(result)
// })
