const path = require('path')
const { spawn } = require('child_process')
const chalk = require('chalk')

const PRINT_ENABLED = false
const pkg = JSON.stringify(path.join(__dirname, '..', '..', 'index.js'))

const EXIT_CODES_KV = { ok: 0, error: 1 }
const EXIT_CODES_VK = { 0: 'ok', 1: 'error' }

module.exports = { tester, spawner, standardizeTap }

async function tester (name, fn, expectedOut, expectedMore) {
  log(chalk.yellow.bold('Tester'), name)
  name = JSON.stringify(name)

  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\ntest(${name}, _fn)`
  // print('tester', 'yellow', script)
  return executeTap(script, expectedOut, expectedMore)
}

async function spawner (fn, expectedOut, expectedMore) {
  log(chalk.yellow.bold('Spawner'))
  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\n_fn(test)`
  // print('spawner', 'yellow', script)
  return executeTap(script, expectedOut, expectedMore)
}

async function executeTap (script, expectedOut, more = {}) {
  if (typeof expectedOut === 'object') [more, expectedOut] = [expectedOut, '']

  const { exitCode, error, stdout, stderr } = await executeCode(script)
  const errors = new Errors()
  let tapout
  let tapexp
  // log({ exitCode, error, stdout, stderr })
  // log({ expectedOut, more })

  if (more.exitCode !== undefined) {
    if (typeof more.exitCode === 'number') {
      if (exitCode !== more.exitCode) {
        errors.add('EXIT_CODE_MISMATCH', 'exitCode is not the expected', exitCode, more.exitCode)
      }
    } else if (typeof more.exitCode === 'string') {
      if (EXIT_CODES_VK[exitCode] === undefined || EXIT_CODES_KV[more.exitCode] === undefined || exitCode !== EXIT_CODES_KV[more.exitCode]) {
        errors.add('EXIT_CODE_MISMATCH', 'exitCode is not the expected', exitCode + ' (' + EXIT_CODES_VK[exitCode] + ')', EXIT_CODES_KV[more.exitCode] + ' (' + more.exitCode + ')')
      }
    } else {
      throw new Error('exitCode type not supported (only number or string)')
    }
  }

  stdValidation(errors, 'stderr', stderr, more.stderr)
  stdValidation(errors, 'stdout', stdout, more.stdout)

  if (error) errors.add('NODE_ERROR', error)
  if (!more.stderr && stderr) errors.add('STDERR', stderr)

  if (!error && (more.stderr || !stderr) && expectedOut) {
    tapout = standardizeTap(stdout)
    tapexp = standardizeTap(expectedOut)

    if (tapout !== tapexp) {
      if (!more._silent) print('stdout', 'green', stdout)
      errors.add('TAP_MISMATCH', 'TAP output does not matches the expected output', tapout, tapexp)
    }

    // print('tapout', 'magenta', tapout)
    // print('tapexp', 'cyan', tapexp)
  }

  if (!more._silent && errors.list.length) {
    process.exitCode = 1

    for (const err of errors.list) {
      console.error(chalk.red.bold('Error:'), err.error.message)

      if (Object.hasOwn(err, 'actual') || Object.hasOwn(err, 'expected')) {
        console.error(chalk.red('[actual]'), err.actual)
        console.error(chalk.red('[expected]'), err.expected)
      }
    }
  }

  return { errors: errors.list, exitCode, stdout, tapout, tapexp, stderr }
}

function stdValidation (errors, name, actual, std) {
  // log('stdValidation', { errors, name, actual, std })
  if (std === undefined) return

  if (std && typeof std === 'object') {
    if (std.includes) {
      if (!actual || !actual.includes(std.includes)) {
        errors.add(name.toUpperCase() + '_VALIDATION', name + ' did not include the expected', actual, std.includes)
      }
    }
  } else {
    throw new Error('Expected type not supported (only object)')
  }
}

class Errors {
  constructor () {
    this.list = []
  }

  add (type, error, actual, expected) {
    const err = {
      type,
      error: typeof error === 'string' ? new Error(error) : error
    }

    if (actual !== undefined) err.actual = actual
    if (expected !== undefined) err.expected = expected

    this.list.push(err)
  }
}

function executeCode (script) {
  return new Promise((resolve, reject) => {
    const args = ['-e', script]
    const opts = { timeout: 30000, cwd: path.join(__dirname, '../..') }
    const child = spawn(process.execPath, args, opts)

    let exitCode
    let stdout = ''
    let stderr = ''

    child.on('exit', function (code) {
      exitCode = code
    })

    child.on('close', function () {
      resolve({ exitCode, stdout, stderr })
    })

    child.on('error', function (error) {
      resolve({ exitCode, error, stdout, stderr })
    })

    child.stdout.setEncoding('utf-8')
    child.stderr.setEncoding('utf-8')
    child.stdout.on('data', function (chunk) {
      stdout += chunk
    })
    child.stderr.on('data', function (chunk) {
      stderr += chunk
    })
  })
}

function standardizeTap (stdout) {
  return stdout
    .replace(/#.+\n/g, '\n') // strip comments
    .replace(/\n[^\n]*node:internal[^\n]*\n/g, '\n') // strip internal node stacks
    .replace(/\n[^\n]*(\[eval\])[^\n]*\n/g, '\n') // strip internal node stacks
    .replace(/\n[^\n]*(Test\._run) \((.*):[\d]+:[\d]+\)[^\n]*\n/g, '\n$1 ($2:13:37)\n') // static line numbers for "Test._run"
    .replace(/[/\\]/g, '/')
    .split('\n')
    .map(n => n.trim())
    .filter(n => n)
    .join('\n')
}

function log (str) {
  if (!PRINT_ENABLED) return

  console.log(str)
}

function print (name, color, str) {
  if (!PRINT_ENABLED) return

  console.log(chalk[color]('[' + name + ']'))
  console.log(str)
  console.log(chalk[color]('[/' + name + ']'))
}
