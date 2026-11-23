import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import { isBare } from 'which-runtime'
import { spawner } from './helpers/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cmdPath = path.join(__dirname, '..', 'cmd.js')

function assertFailedSummary(stdout, names, label) {
  const normalized = stdout.replace(/\r\n/g, '\n')
  const block = ['# failed tests', ...names.map((name) => `# - ${name}`)].join('\n')

  if (!normalized.includes(block)) {
    console.error(`Error: ${label}`)
    console.error('[expected block]')
    console.error(block)
    console.error('[actual stdout]')
    console.error(stdout)
    process.exitCode = 1
    return false
  }

  return true
}

function assertNoFailedSummary(stdout, label) {
  if (stdout.includes('# failed tests')) {
    console.error(`Error: ${label}`)
    console.error(stdout)
    process.exitCode = 1
    return false
  }

  return true
}

function runCli(args, script) {
  const repoRoot = path.join(__dirname, '..')
  const relativeScript = path.join(
    'test',
    `_failures-last-cli-${Math.random().toString(16).slice(2)}.js`
  )
  const scriptFile = path.join(repoRoot, relativeScript)
  fs.writeFileSync(scriptFile, script)

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cmdPath, ...args, relativeScript], {
      cwd: repoRoot
    })

    let stdout = ''
    let stderr = ''

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('exit', (exitCode) => {
      fs.rmSync(scriptFile, { force: true })
      resolve({ exitCode, stdout, stderr })
    })
  })
}

const multiple = await spawner(
  function ({ configure, test }) {
    configure({ failuresLast: true })

    test('success', function (t) {
      t.pass()
    })

    test('fail one', function (t) {
      t.fail()
    })

    test('fail two', function (t) {
      t.fail()
    })

    test('success again', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # success
      ok 1 - passed
  ok 1 - success # time = 0.65909ms

  # fail one
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 2 - fail one # time = 3.527995ms

  # fail two
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 3 - fail two # time = 3.527995ms

  # success again
      ok 1 - passed
  ok 4 - success again # time = 0.062494ms

  1..4
  # tests = 2/4 pass
  # asserts = 2/4 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - fail one
  # - fail two
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(multiple.stdout, ['fail one', 'fail two'], 'missing multi-failure summary')

const passing = await spawner(
  function ({ configure, test }) {
    configure({ failuresLast: true })

    test('all good', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # all good
      ok 1 - passed
  ok 1 - all good # time = 0.295115ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 18.422843ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
assertNoFailedSummary(passing.stdout, 'unexpected summary on passing run')

const flagOff = await spawner(
  function ({ test }) {
    test('success', function (t) {
      t.pass()
    })

    test('fail', function (t) {
      t.fail()
    })
  },
  `
  TAP version 13

  # success
      ok 1 - passed
  ok 1 - success # time = 0.65909ms

  # fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 2 - fail # time = 3.527995ms

  1..2
  # tests = 1/2 pass
  # asserts = 1/2 pass
  # time = 7.795403ms

  # not ok
  `,
  { exitCode: 1, stderr: '' }
)
assertNoFailedSummary(flagOff.stdout, 'summary printed without failuresLast')

const bail = await spawner(
  function ({ configure, test }) {
    configure({ bail: true, failuresLast: true })

    test('success', function (t) {
      t.pass()
    })

    test('fail', function (t) {
      t.fail()
    })

    test('success again', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # success
      ok 1 - passed
  ok 1 - success # time = 0.691659ms

  # fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 2 - fail # time = 3.498153ms
  Bail out!

  # failed tests
  # - fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(bail.stdout, ['fail'], 'missing bail failures-last summary')

const solo = await spawner(
  function ({ configure, test, solo }) {
    configure({ solo: true, failuresLast: true })

    test('skipped non-solo', function (t) {
      t.fail()
    })

    solo('solo fail', function (t) {
      t.fail()
    })

    solo('solo pass', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # solo fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 1 - solo fail # time = 3.498153ms

  # solo pass
      ok 1 - passed
  ok 2 - solo pass # time = 0.05ms

  1..2
  # tests = 1/2 pass
  # asserts = 1/2 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - solo fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(solo.stdout, ['solo fail'], 'missing solo failures-last summary')

const skipped = await spawner(
  function ({ configure, test, skip }) {
    configure({ failuresLast: true })

    skip('skipped', function (t) {
      t.fail()
    })

    test('actual fail', function (t) {
      t.fail()
    })
  },
  `
  TAP version 13

  # skipped
  ok 1 - skipped # SKIP

  # actual fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 2 - actual fail # time = 3.498153ms

  1..2
  # tests = 1/2 pass
  # asserts = 0/1 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - actual fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(skipped.stdout, ['actual fail'], 'skip mixed into failures-last summary')
if (skipped.stdout.includes('# - skipped')) {
  console.error('Error: skipped test listed as failure')
  console.error(skipped.stdout)
  process.exitCode = 1
}

const stealth = await spawner(
  function ({ configure, stealth, test }) {
    configure({ failuresLast: true })

    stealth('stealth fail', function (t) {
      t.fail('hidden unless fails')
    })

    test('visible pass', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # stealth fail
      not ok 1 - hidden unless fails
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 1 - stealth fail # time = 2.513549ms

  # visible pass
      ok 1 - passed
  ok 2 - visible pass # time = 0.205535ms

  1..2
  # tests = 1/2 pass
  # asserts = 1/2 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - stealth fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(stealth.stdout, ['stealth fail'], 'missing stealth failure summary')

const nested = await spawner(
  function ({ configure, test }) {
    configure({ failuresLast: true })

    test('parent with nested fail', function (t) {
      t.test('nested', function (t) {
        t.fail()
      })
    })

    test('top level fail', function (t) {
      t.fail()
    })
  },
  `
  TAP version 13

  # parent with nested fail
      not ok 1 - (nested) - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 1 - parent with nested fail # time = 3ms

  # top level fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 2 - top level fail # time = 3ms

  1..2
  # tests = 0/2 pass
  # asserts = 0/2 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - parent with nested fail
  # - top level fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(
  nested.stdout,
  ['parent with nested fail', 'top level fail'],
  'missing top-level nested failure summary'
)
if (/\n# - nested(?:\n|$)/.test(nested.stdout.replace(/\r\n/g, '\n'))) {
  console.error('Error: nested child listed separately in failures-last summary')
  console.error(nested.stdout)
  process.exitCode = 1
}

const inverted = await spawner(
  function ({ configure, test }) {
    configure({ failuresLast: true })

    const t = test('inverted fail')
    t.fail()
    t.end()

    test('classic pass', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # inverted fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 1 - inverted fail # time = 3ms

  # classic pass
      ok 1 - passed
  ok 2 - classic pass # time = 0.05ms

  1..2
  # tests = 1/2 pass
  # asserts = 1/2 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - inverted fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(inverted.stdout, ['inverted fail'], 'missing inverted failure summary')

const picked = await spawner(
  function ({ configure, test }) {
    configure({ pick: 1, failuresLast: true })

    test('zeroth pass', function (t) {
      t.pass()
    })

    test('picked fail', function (t) {
      t.fail()
    })

    test('second fail not run', function (t) {
      t.fail()
    })
  },
  `
  TAP version 13

  # picked fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 1 - picked fail # time = 3ms

  1..1
  # tests = 0/1 pass
  # asserts = 0/1 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - picked fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(picked.stdout, ['picked fail'], 'missing pick failures-last summary')
if (picked.stdout.includes('# - second fail not run') || picked.stdout.includes('# - zeroth pass')) {
  console.error('Error: pick ran unexpected tests in failures-last summary')
  console.error(picked.stdout)
  process.exitCode = 1
}

const autoExit = await spawner(
  function ({ configure, test }) {
    configure({ autoExit: true, failuresLast: true })

    test('auto exit fail', function (t) {
      t.fail()
    })

    test('auto exit pass', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # auto exit fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 1 - auto exit fail # time = 3ms

  # auto exit pass
      ok 1 - passed
  ok 2 - auto exit pass # time = 0.05ms

  1..2
  # tests = 1/2 pass
  # asserts = 1/2 pass
  # time = 7.795403ms

  # not ok

  # failed tests
  # - auto exit fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(autoExit.stdout, ['auto exit fail'], 'missing autoExit failures-last summary')

const multiFile = await spawner(
  async function (brittle) {
    brittle.configure({ failuresLast: true })
    brittle.pause()
    await brittle.load(require.resolve('./fixtures/threads/failures-last/alpha.js'))
    await brittle.load(require.resolve('./fixtures/threads/failures-last/beta.js'))
    brittle.resume()
  },
  `
  TAP version 13

  # alpha pass
      ok 1 - passed
  ok 1 - alpha pass # time = 0ms

  # alpha fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 2 - alpha fail # time = 0ms

  # beta fail
      not ok 1 - failed
        ---
        operator: fail
        stack: |
          ...
        ...
  not ok 3 - beta fail # time = 0ms

  # beta pass
      ok 1 - passed
  ok 4 - beta pass # time = 0ms

  1..4
  # tests = 2/4 pass
  # asserts = 2/4 pass
  # time = 0ms

  # not ok

  # failed tests
  # - alpha fail
  # - beta fail
  `,
  { exitCode: 1, stderr: '' }
)
assertFailedSummary(
  multiFile.stdout,
  ['alpha fail', 'beta fail'],
  'missing multi-file load failures-last summary'
)

const timedOut = await spawner(
  function ({ configure, test }) {
    configure({ failuresLast: true })

    test('will timeout', { timeout: 10 }, async function () {
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
    })
  },
  `
  TAP version 13

  # will timeout
  not ok 1 - will timeout

  # failed tests
  # - will timeout
  `,
  { exitCode: 'error', stderr: { includes: 'timed out after 10 ms' } }
)
assertFailedSummary(timedOut.stdout, ['will timeout'], 'missing timeout failures-last summary')

const thrown = await spawner(
  function ({ configure, test }) {
    configure({ failuresLast: true })

    test('throws', function () {
      throw new Error('boom')
    })
  },
  `
  TAP version 13

  # throws
  not ok 1 - throws

  # failed tests
  # - throws
  `,
  { exitCode: 'error', stderr: { includes: 'boom' } }
)
assertFailedSummary(thrown.stdout, ['throws'], 'missing thrown failures-last summary')

const cliOn = await runCli(
  ['--failures-last'],
  `
const test = require(${JSON.stringify(path.join(__dirname, '..', 'index.js'))})
test('ok', (t) => t.pass())
test('boom', (t) => t.fail())
`
)
if (cliOn.exitCode !== 1) {
  console.error('Error: CLI --failures-last expected exit 1, got', cliOn.exitCode)
  process.exitCode = 1
}
assertFailedSummary(cliOn.stdout, ['boom'], 'CLI --failures-last missing summary')

const cliOff = await runCli(
  [],
  `
const test = require(${JSON.stringify(path.join(__dirname, '..', 'index.js'))})
test('ok', (t) => t.pass())
test('boom', (t) => t.fail())
`
)
if (cliOff.exitCode !== 1) {
  console.error('Error: CLI without flag expected exit 1, got', cliOff.exitCode)
  process.exitCode = 1
}
assertNoFailedSummary(cliOff.stdout, 'CLI printed summary without --failures-last')

const mined = await runCli(
  ['--failures-last', '--mine', '1'],
  `
const test = require(${JSON.stringify(path.join(__dirname, '..', 'index.js'))})
test('mine fail', (t) => t.fail())
`
)
if (!mined.exitCode) {
  console.error('Error: CLI --mine --failures-last expected non-zero exit, got', mined.exitCode)
  process.exitCode = 1
}
assertFailedSummary(mined.stdout, ['mine fail'], 'CLI --mine missing failures-last summary')

if (isBare) {
  const threaded = await spawner(
    async function (brittle) {
      brittle.configure({ jobs: 2, failuresLast: true })
      brittle.pause()
      await brittle.load(require.resolve('./fixtures/threads/failures-last/alpha.js'))
      await brittle.load(require.resolve('./fixtures/threads/failures-last/beta.js'))
      brittle.resume()
    },
    `
    TAP version 13

    # alpha pass
        ok 1 - passed
    ok 1 - alpha pass # time = 0ms

    # alpha fail
        not ok 1 - failed
          ---
          operator: fail
          stack: |
            ...
          ...
    not ok 2 - alpha fail # time = 0ms

    # beta fail
        not ok 1 - failed
          ---
          operator: fail
          stack: |
            ...
          ...
    not ok 3 - beta fail # time = 0ms

    # beta pass
        ok 1 - passed
    ok 4 - beta pass # time = 0ms

    1..4
    # tests = 2/4 pass
    # asserts = 2/4 pass
    # time = 0ms

    # not ok

    # failed tests
    # - alpha fail
    # - beta fail
    `,
    { exitCode: 1, stderr: '' }
  )
  assertFailedSummary(
    threaded.stdout,
    ['alpha fail', 'beta fail'],
    'missing threaded failures-last summary'
  )
} else {
  const bareBin = [
    path.join(__dirname, '..', 'node_modules', 'bare-runtime', 'bin', 'bare'),
    path.join(__dirname, '..', 'node_modules', '.bin', 'bare'),
    'bare'
  ].find((candidate) => {
    try {
      if (candidate === 'bare') return true
      return fs.existsSync(candidate)
    } catch {
      return false
    }
  })

  const entry = path.join('test', 'fixtures', 'threads', 'failures-last', 'entry.js')
  const jobs = await new Promise((resolve) => {
    const child = spawn(bareBin, [entry], {
      cwd: path.join(__dirname, '..')
    })

    let stdout = ''
    let stderr = ''

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', (error) => {
      resolve({ exitCode: null, stdout, stderr: String(error) })
    })
    child.on('exit', (exitCode) => {
      resolve({ exitCode, stdout, stderr })
    })
  })

  if (jobs.exitCode === null || /ENOENT|not found/i.test(jobs.stderr)) {
    console.error('Error: bare runtime unavailable; cannot verify --jobs failures-last aggregation')
    console.error(jobs.stderr)
    process.exitCode = 1
  } else {
    if (jobs.exitCode !== 1) {
      console.error('Error: bare jobs failures-last expected exit 1, got', jobs.exitCode)
      console.error(jobs.stderr)
      process.exitCode = 1
    }
    assertFailedSummary(
      jobs.stdout,
      ['alpha fail', 'beta fail'],
      'missing bare --jobs failures-last summary'
    )
  }
}
