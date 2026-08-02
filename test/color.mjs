import assert from 'assert'
import path from 'path'
import process from 'process'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { raw } from './helpers/index.js'
import { createColors, isColorSupported } from '../lib/colors.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GRAY = '\x1b[90m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'
const BOLD_GREEN = BOLD + GREEN
const BOLD_RED = BOLD + RED
const BOLD_YELLOW = BOLD + YELLOW

// a known-neutral environment, so that a NO_COLOR/FORCE_COLOR in the ambient
// environment cannot flip the expectations below
const NEUTRAL = { NO_COLOR: '', FORCE_COLOR: '', TERM: 'xterm-256color' }

// createColors(false) leaves every string untouched

{
  const colors = createColors(false)
  assert.strictEqual(colors.enabled, false)
  const names = ['green', 'red', 'yellow', 'gray', 'bold', 'dim', 'boldGreen', 'boldRed']
  for (const name of names) {
    assert.strictEqual(colors[name]('ok 1 - passed'), 'ok 1 - passed')
  }
}

// createColors(true) wraps in the matching SGR sequence

{
  const colors = createColors(true)
  assert.strictEqual(colors.enabled, true)
  assert.strictEqual(colors.green('ok'), GREEN + 'ok' + RESET)
  assert.strictEqual(colors.red('not ok'), RED + 'not ok' + RESET)
  assert.strictEqual(colors.yellow('SKIP'), YELLOW + 'SKIP' + RESET)
  assert.strictEqual(colors.gray('---'), GRAY + '---' + RESET)
  assert.strictEqual(colors.bold('# test'), BOLD + '# test' + RESET)
  assert.strictEqual(colors.dim('# time = 0ms'), DIM + '# time = 0ms' + RESET)
  assert.strictEqual(colors.boldGreen('# ok'), BOLD_GREEN + '# ok' + RESET)
  assert.strictEqual(colors.boldRed('# not ok'), BOLD_RED + '# not ok' + RESET)
  assert.strictEqual(colors.boldYellow('# SKIP'), BOLD_YELLOW + '# SKIP' + RESET)
}

// empty strings and blank lines are never wrapped, other lines are wrapped individually

{
  const colors = createColors(true)
  assert.strictEqual(colors.green(''), '')
  assert.strictEqual(
    colors.gray('---\n\nactual: 1'),
    GRAY + '---' + RESET + '\n\n' + GRAY + 'actual: 1' + RESET
  )
}

// non-strings are coerced

{
  const colors = createColors(true)
  assert.strictEqual(colors.green(1), GREEN + '1' + RESET)
}

// detection defaults to whatever the current stdout is

{
  assert.strictEqual(typeof isColorSupported(), 'boolean')
  assert.strictEqual(createColors().enabled, isColorSupported())
}

// env precedence, one child process per case. The environment is not mutated in
// place because that is not portable across runtimes.

{
  const cases = [
    { env: { FORCE_COLOR: '1' }, color: true, why: 'FORCE_COLOR enables' },
    { env: { FORCE_COLOR: '1', NO_COLOR: '1' }, color: false, why: 'NO_COLOR beats FORCE_COLOR' },
    { env: { FORCE_COLOR: '0' }, color: false, why: 'FORCE_COLOR=0 disables' },
    { env: { FORCE_COLOR: 'false' }, color: false, why: 'FORCE_COLOR=false disables' },
    { env: { TERM: 'dumb' }, color: false, why: 'TERM=dumb disables' },
    { env: { FORCE_COLOR: '1', TERM: 'dumb' }, color: true, why: 'FORCE_COLOR beats TERM=dumb' },
    { env: {}, color: false, why: 'a pipe is not colorized' }
  ]

  for (const { env, color, why } of cases) {
    const { stdout, exitCode } = await raw(
      function (test) {
        test('detect', (t) => t.pass())
      },
      { env: { ...NEUTRAL, ...env } }
    )

    assert.strictEqual(exitCode, 0, why)
    assert.strictEqual(stdout.includes('\x1b['), color, why)
  }
}

// FORCE_COLOR colorizes passes, skips, todos, failures and the summary

{
  const { stdout } = await raw(
    function (test) {
      test('passing', (t) => {
        t.plan(1)
        t.pass('yes')
      })
      test('skipping', { skip: true }, (t) => t.pass())
      test('todoing', { todo: true }, (t) => t.pass())
      test('failing', (t) => {
        t.plan(1)
        t.comment('here we go')
        t.fail('nope')
      })
    },
    { env: { ...NEUTRAL, FORCE_COLOR: '1' } }
  )

  assert.ok(stdout.includes(DIM + 'TAP version 13' + RESET), 'TAP version line is dimmed')
  assert.ok(stdout.includes(BOLD + '# passing' + RESET), 'test name comments are bold')
  assert.ok(stdout.includes(DIM + '    # here we go' + RESET), 'nested comments are dimmed')

  assert.ok(stdout.includes('    ' + GREEN + 'ok' + RESET + ' 1 - yes'), 'passing assert is green')
  assert.ok(
    stdout.includes(BOLD_GREEN + 'ok' + RESET + ' 1 - passing' + DIM + ' # time = '),
    'a passing test is bold green with a dimmed timing'
  )

  assert.ok(
    stdout.includes(
      BOLD_YELLOW +
        'ok' +
        RESET +
        YELLOW +
        ' 2 - skipping' +
        RESET +
        BOLD_YELLOW +
        ' # SKIP' +
        RESET
    ),
    'a skipped test is yellow with a bold marker'
  )
  assert.ok(
    stdout.includes(
      BOLD_YELLOW + 'ok' + RESET + YELLOW + ' 3 - todoing' + RESET + BOLD_YELLOW + ' # TODO' + RESET
    ),
    'a todo test is yellow with a bold marker'
  )

  assert.ok(
    stdout.includes(BOLD_RED + 'not ok' + RESET + RED + ' 1 - nope' + RESET),
    'a failing assert is red with a bold status'
  )
  assert.ok(stdout.includes(DIM + '      ---' + RESET), 'the explanation delimiters are dimmed')
  assert.ok(stdout.includes(BOLD_RED + 'not ok' + RESET + RED + ' 4 - failing' + RESET))

  assert.ok(stdout.includes(DIM + '1..4' + RESET), 'the plan line is dimmed')
  assert.ok(stdout.includes(BOLD_RED + '# tests = 3/4 pass' + RESET), 'a failing tally is bold red')
  assert.ok(
    stdout.includes(BOLD_RED + '# asserts = 1/2 pass' + RESET),
    'a failing tally is bold red'
  )
  assert.ok(stdout.includes(DIM + '# time = '), 'the total time is dimmed')
  assert.ok(stdout.includes(BOLD_RED + '# not ok' + RESET), 'the final verdict is bold red')
}

// the explanation reads like a diff: expected green, actual red, pointer highlighted

{
  const { stdout } = await raw(
    function (test) {
      test('failing', (t) => {
        t.plan(1)
        t.is(1, 2, 'one is two')
      })
    },
    { env: { ...NEUTRAL, FORCE_COLOR: '1' } }
  )

  assert.ok(
    stdout.includes(BOLD_RED + '      actual:' + RESET + ' ' + RED + '1' + RESET),
    'actual is red'
  )
  assert.ok(
    stdout.includes(BOLD_GREEN + '      expected:' + RESET + ' ' + GREEN + '2' + RESET),
    'expected is green'
  )
  assert.ok(
    stdout.includes(BOLD + '      operator:' + RESET + ' ' + GRAY + 'is' + RESET),
    'other keys are bold with gray values'
  )
  assert.ok(/\x1b\[1m\x1b\[31m\s*-*\^\x1b\[0m/.test(stdout), 'the source pointer is bold red')
  assert.ok(/\x1b\[90m\s+t\.is\(1, 2, 'one is two'\)\x1b\[0m/.test(stdout), 'source lines are gray')
  assert.ok(
    /\x1b\[1m {6}stack:\x1b\[0m \x1b\[90m\|\x1b\[0m\n\x1b\[2m\s+\S/.test(stdout),
    'stack frames are dimmed'
  )
}

// an all-passing run gets green tallies and a green verdict

{
  const { stdout } = await raw(
    function (test) {
      test('passing', (t) => t.pass())
    },
    { env: { ...NEUTRAL, FORCE_COLOR: '1' } }
  )

  assert.ok(stdout.includes(GREEN + '# tests = 1/1 pass' + RESET), 'passing tally is green')
  assert.ok(stdout.includes(GREEN + '# asserts = 1/1 pass' + RESET), 'passing tally is green')
  assert.ok(stdout.includes(BOLD_GREEN + '# ok' + RESET), 'the final verdict is bold green')
}

// configure({ color }) overrides detection in both directions

{
  const { stdout } = await raw(
    function ({ test, configure }) {
      configure({ color: false })
      test('plain', (t) => t.pass())
    },
    { env: { ...NEUTRAL, FORCE_COLOR: '1' } }
  )

  assert.ok(!stdout.includes('\x1b['), 'configure({ color: false }) disables colors')
}

{
  const { stdout } = await raw(
    function ({ test, configure }) {
      configure({ color: true })
      test('colored', (t) => t.pass())
    },
    { env: NEUTRAL }
  )

  assert.ok(
    stdout.includes(BOLD_GREEN + '# ok' + RESET),
    'configure({ color: true }) enables colors'
  )
}

// the bail out line is red

{
  const { stdout } = await raw(
    function ({ test, configure }) {
      configure({ bail: true, color: true })
      test('failing', (t) => {
        t.plan(1)
        t.fail()
      })
    },
    { env: NEUTRAL }
  )

  assert.ok(stdout.includes(BOLD_RED + 'Bail out!' + RESET), 'Bail out! is bold red')
}

// --color and --no-color override detection from the CLI

{
  const cmd = path.join(__dirname, '..', 'cmd.js')
  const fixture = 'test/fixtures/colors/passing.js' // relative: the glob rejects absolute paths

  const forced = await run([cmd, '--color', fixture], NEUTRAL)
  assert.strictEqual(forced.exitCode, 0)
  assert.ok(forced.stdout.includes(BOLD_GREEN + '# ok' + RESET), '--color forces colors on a pipe')

  const disabled = await run([cmd, '--no-color', fixture], { ...NEUTRAL, FORCE_COLOR: '1' })
  assert.strictEqual(disabled.exitCode, 0)
  assert.ok(!disabled.stdout.includes('\x1b['), '--no-color forces colors off')

  const auto = await run([cmd, fixture], NEUTRAL)
  assert.strictEqual(auto.exitCode, 0)
  assert.ok(!auto.stdout.includes('\x1b['), 'no flag means auto-detect')
}

// the mixed fixture exercises every colorized line kind at once

{
  const cmd = path.join(__dirname, '..', 'cmd.js')
  const fixture = 'test/fixtures/colors/mixed.js'

  const { stdout, exitCode } = await run([cmd, '--color', fixture], NEUTRAL)

  assert.notStrictEqual(exitCode, 0, 'the fixture has a failing test')
  assert.ok(stdout.includes(GREEN + 'ok' + RESET + ' 1 - a passing assertion'), 'pass is green')
  assert.ok(stdout.includes(BOLD_GREEN + 'ok' + RESET + ' 1 - passing' + DIM), 'test line is bold')
  assert.ok(stdout.includes(BOLD_YELLOW + ' # SKIP' + RESET), 'the skip marker is bold yellow')
  assert.ok(stdout.includes(BOLD_YELLOW + ' # TODO' + RESET), 'the todo marker is bold yellow')
  assert.ok(stdout.includes(DIM + '    # a nested comment' + RESET), 'nested comment is dim')
  assert.ok(
    stdout.includes('    ' + GREEN + 'ok' + RESET + ' 1 - (child) - a nested assertion'),
    'nested pass is green'
  )
  assert.ok(
    stdout.includes(BOLD_RED + 'not ok' + RESET + RED + ' 1 - one is two' + RESET),
    'failing assert is red'
  )
  assert.ok(stdout.includes(DIM + '      ---' + RESET), 'the explanation delimiter is dim')
  assert.ok(stdout.includes(BOLD_RED + '# not ok' + RESET), 'the verdict is bold red')
}

function run(args, env) {
  return new Promise((resolve, reject) => {
    const opts = { cwd: path.join(__dirname, '..') }
    if (env) opts.env = { ...process.env, ...env }

    const child = spawn(process.execPath, args, opts)

    let stdout = ''
    let stderr = ''

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', (data) => {
      stdout += data
    })
    child.stderr.on('data', (data) => {
      stderr += data
    })

    child.on('error', reject)
    child.on('exit', (exitCode) => resolve({ exitCode, stdout, stderr }))
  })
}
