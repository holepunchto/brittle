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
  return executeTap(script, expectedOut, expectedMore)
}

async function spawner (fn, expectedOut, expectedMore) {
  log(chalk.yellow.bold('Spawner'))
  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\n_fn(test)`
  return executeTap(script, expectedOut, expectedMore)
}

async function executeTap (script, expectedOut, more = {}) {
  if (typeof expectedOut !== 'string') throw new Error('Expected stdout is required as a string')
  if (more.stderr === undefined) throw new Error('Expected stderr is required')

  const { exitCode, error, stdout, stderr } = await executeCode(script)
  const errors = new Errors()
  let tapout
  let tapexp
  // log({ exitCode, error, stdout, stderr })
  // log({ expectedOut, more })

  exitCodeValidation(errors, exitCode, more.exitCode)

  stdValidation(errors, 'stderr', stderr, more.stderr)

  if (error) errors.add('NODE_ERROR', error)
  if (!more.stderr && stderr) errors.add('STDERR', stderr)

  if (!error && expectedOut !== undefined) {
    tapout = standardizeTap(stdout)
    tapexp = standardizeTap(expectedOut)

    if (tapout !== tapexp) {
      errors.add('TAP_MISMATCH', 'TAP output does not match the expected output', stdout, expectedOut)
    }
  }

  if (!more._silent && errors.list.length) {
    process.exitCode = 1

    for (const err of errors.list) {
      console.error(chalk.red.bold('Error:'), err.error.message)

      if (Object.hasOwn(err, 'actual') || Object.hasOwn(err, 'expected')) {
        console.error(chalk.red('[actual]'))
        console.error(err.actual)
        console.error(chalk.red('[expected]'))
        console.error(err.expected)
      }
    }
  }

  return { errors: errors.list, exitCode, stdout, tapout, tapexp, stderr }
}

function exitCodeValidation (errors, actual, expected) {
  if (expected === undefined) return

  if (typeof expected === 'number') {
    if (actual !== expected) {
      errors.add('EXIT_CODE_MISMATCH', 'exitCode is not the expected', actual, expected)
    }
    return
  }

  if (typeof expected === 'string') {
    const expectedCode = EXIT_CODES_KV[expected]
    const errorName = EXIT_CODES_VK[actual]
    if (errorName === undefined || expectedCode === undefined || actual !== expectedCode) {
      errors.add('EXIT_CODE_MISMATCH', 'exitCode is not the expected', actual + ' (' + errorName + ')', expectedCode + ' (' + expected + ')')
    }
    return
  }

  throw new Error('exitCode type not supported (only number or string)')
}

function stdValidation (errors, name, actual, std) {
  // log('stdValidation', { errors, name, actual, std })
  if (std === undefined) return

  if (typeof std === 'string') {
    if (actual !== std) {
      errors.add(name.toUpperCase() + '_VALIDATION', name + ' is not the expected', actual, std)
    }
    return
  }

  if (typeof std === 'object' && std) {
    if (typeof std.includes === 'string') {
      if (!std.includes) {
        throw new Error('Expected stderr.includes can not be empty')
      }

      if (!actual || !actual.includes(std.includes)) {
        errors.add(name.toUpperCase() + '_VALIDATION', name + ' did not include the expected', actual, std.includes)
      }
      return
    }

    throw new Error('Expected stderr is required')
  }

  throw new Error('Expected type not supported (only string or object)')
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
    .replace(/#.+(?:\n|$)/g, '\n') // strip comments
    .replace(/\n[^\n]*node:(?:internal|vm)[^\n]*/g, '\n') // strip internal node stacks
    .replace(/\n[^\n]*(\[eval\])[^\n]*/g, '\n') // strip internal node stacks
    .replace(/\n[^\n]*(Test\._(run|test|stealth)) \((.*):[\d]+:[\d]+\)[^\n]*/g, '\n$1 ($2:13:37)') // static line numbers for "Test._run/stealth/test"
    .replace(/[/\\]/g, '/')
    .replace(/\n[^|\n]+\|[^|\n]+\|[^|\n]+\|[^|\n]+\|[^|\n]+\|[^|\n]*/g, '\n[coverage-line]')
    .replace(/(\n\[coverage-line])+/g, '\n[coverage]')
    .split('\n')
    .map(n => n.trim())
    .filter(n => n)
    .join('\n')
}

function log (...str) {
  if (!PRINT_ENABLED) return

  console.log(...str)
}
