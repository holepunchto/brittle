import assert from 'assert'
import { spawn, spawnSync } from 'child_process'
import os from 'os'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import { isBare, isWindows } from 'which-runtime'
import { standardizeTap } from './helpers/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.join(__dirname, '..')
const cwd = path.join(__dirname, 'fixtures', 'expose-gc')
const entry = path.join(root, isBare ? 'brittle-bare.js' : 'brittle-node.js')
const bareEntry = path.join(root, 'brittle-bare.js')

const EXPECTED_PASS_TAP = `
TAP version 13

# gc is exposed
    ok 1 - passed
ok 1 - gc is exposed # time = 0.5ms

1..1
# tests = 1/1 pass
# asserts = 1/1 pass
# time = 1ms

# ok
`

// Fails without --expose-gc
{
  const res = await run([entry, 'pass.js'])
  assert.ok(res.exitCode !== 0 || res.signal !== null)
  assert.ok(res.stderr.includes('gc is not defined'), res.stderr)
}

// Passes with --expose-gc
{
  const res = await run([entry, '--expose-gc', 'pass.js'])
  assert.strictEqual(res.exitCode, 0)
  assert.strictEqual(res.signal, null)
  assert.strictEqual(res.stderr, '')
  assert.strictEqual(standardizeTap(res.stdout), standardizeTap(EXPECTED_PASS_TAP))
}

// Passes with BRITTLE=--expose-gc
{
  const res = await run([entry, 'pass.js'], { env: { BRITTLE: '--expose-gc' } })
  assert.strictEqual(res.exitCode, 0)
  assert.strictEqual(res.signal, null)
  assert.strictEqual(res.stderr, '')
  assert.strictEqual(standardizeTap(res.stdout), standardizeTap(EXPECTED_PASS_TAP))
}

// Does not treat --expose-gc after -- as a flag (Node only: Bare itself exposes gc() for
// --expose-gc anywhere in its arguments)
if (!isBare) {
  const res = await run([entry, '--', '--expose-gc', 'pass.js'])
  assert.ok(res.exitCode !== 0 || res.signal !== null)
  assert.ok(res.stderr.includes('gc is not defined'), res.stderr)
}

// Lists --expose-gc in --help
{
  const res = await run([entry, '--help'])
  assert.strictEqual(res.exitCode, 0)
  assert.ok(res.stdout.includes('--expose-gc'), res.stdout)
}

// Forwards --expose-gc to --mine subprocesses (not on Windows under Bare, where --mine with piped
// output doesn't exit, with or without --expose-gc)
if (!(isBare && isWindows)) {
  const res = await run([entry, '--expose-gc', '--mine', '1', 'mine.js'])
  assert.strictEqual(res.exitCode, 1)
  assert.strictEqual(res.stderr, '')
  assert.ok(res.stdout.includes('not ok 1 - stop mining'), res.stdout)
}

// Stops on SIGTERM (off Windows, where kill terminates without signal interception)
if (!isWindows) {
  let killed = false
  const onData = (stdout, child) => {
    if (killed || !stdout.includes('# ready')) return
    killed = true
    child.kill('SIGTERM')
  }

  const res = await run([entry, '--expose-gc', 'hang.js'], { onData })
  assert.strictEqual(res.signal, 'SIGTERM')

  if (isBare) {
    killed = false
    const envOpts = { env: { BRITTLE: '--expose-gc' }, onData }
    const envRes = await run([entry, 'hang.js'], envOpts)
    assert.strictEqual(envRes.exitCode, 0x80 | os.constants.signals.SIGTERM)
  }
}

if (isBare) {
  // Works across worker threads with --jobs
  const jobsRes = await run([entry, '--expose-gc', '--jobs', '2', 'pass.js', 'other.js'])
  assert.strictEqual(jobsRes.exitCode, 0)
  assert.strictEqual(jobsRes.signal, null)
  assert.strictEqual(jobsRes.stderr, '')

  // Node -> Bare fallback passes --expose-gc
  const nodeBin = isWindows ? 'node.exe' : 'node'
  const bareBin = isWindows ? 'bare.exe' : 'bare'
  const canSpawnNode = spawnSync(nodeBin, ['--version']).status === 0
  const canSpawnBare = spawnSync(bareBin, ['--version']).status === 0
  if (canSpawnNode && canSpawnBare) {
    const res = await run([bareEntry, '--expose-gc', 'pass.js'], { bin: nodeBin })
    assert.strictEqual(res.exitCode, 0)
    assert.strictEqual(res.signal, null)
    assert.strictEqual(res.stderr, '')
    assert.strictEqual(standardizeTap(res.stdout), standardizeTap(EXPECTED_PASS_TAP))
  }
}

function run(args, opts = {}) {
  const { env: envOverrides = {}, bin = process.execPath, timeout = 120000, onData } = opts

  return new Promise((resolve, reject) => {
    const env = { ...process.env }
    delete env.BRITTLE
    delete env.NODE_OPTIONS
    Object.assign(env, envOverrides)

    const child = spawn(bin, args, { cwd, env })
    let stdout = ''
    let stderr = ''
    let settled = false

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      child.kill()
      child.stdin?.destroy()
      child.stdout?.destroy()
      child.stderr?.destroy()
      const cmd = [bin, ...args].join(' ')
      const msg = `Timed out after ${timeout}ms: ${cmd}\nstdout:\n${stdout}\nstderr:\n${stderr}`
      reject(new Error(msg))
    }, timeout)

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
      if (onData) onData(stdout, child)
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })

    child.on('error', (err) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reject(err)
    })
    child.on('close', (exitCode, signal) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      stdout = stdout.replaceAll('\r\n', '\n')
      stderr = stderr.replaceAll('\r\n', '\n')
      resolve({ exitCode, signal, stdout, stderr })
    })
  })
}
