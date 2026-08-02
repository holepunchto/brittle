import assert from 'assert'
import { createColors, isColorSupported } from '../lib/colors.js'

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
