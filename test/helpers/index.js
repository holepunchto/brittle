const path = require('path')
const { spawn } = require('child_process')
const chalk = require('chalk')

const PRINT_ENABLED = false
const pkg = JSON.stringify(path.join(__dirname, '..', '..', 'index.js'))

module.exports = { tester, spawner, standardizeTap }

async function tester (name, fn, expectedOut, expectedMore) {
  name = JSON.stringify(name)

  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\ntest(${name}, _fn)`
  print('tester', 'yellow', script)
  return executeTap(script, expectedOut, expectedMore)
}

async function spawner (fn, expectedOut, expectedMore) {
  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\n_fn(test)`
  print('spawner', 'yellow', script)
  return executeTap(script, expectedOut, expectedMore)
}

async function executeTap (script, expectedOut, more = {}) {
  if (typeof expectedOut === 'object') [more, expectedOut] = [expectedOut, '']

  const { exitCode, error, stdout, stderr } = await executeCode(script)
  const errors = new Errors()
  let tapout
  let tapexp
  // console.log({ exitCode, error, stdout, stderr })
  // console.log({ expectedOut, more })

  if (more.exitCode !== undefined && exitCode !== more.exitCode) {
    errors.add('exitCode is the expected', exitCode, more.exitCode)
  }

  stdValidation(errors, 'stderr', stderr, more.stderr)

  if (error) errors.add(error)
  if (!more.stderr && stderr) errors.add(stderr)

  if (!error && (more.stderr || !stderr) && expectedOut) {
    tapout = standardizeTap(stdout)
    tapexp = standardizeTap(expectedOut)

    if (tapout !== tapexp) {
      errors.add('TAP output matches the expected output', tapout, tapexp)
    }

    print('stdout', 'green', stdout)
    print('tapout', 'magenta', tapout)
    print('tapexp', 'cyan', tapexp)
  }

  if (errors.list.length) {
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
  // console.log('stdValidation', { errors, name, actual, std })
  if (std === undefined) return

  if (std && typeof std === 'object') {
    if (std.includes) {
      if (!actual || !actual.includes(std.includes)) {
        errors.add(name + ' did not include the expected', actual, std.includes)
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

  add (error, actual, expected) {
    const err = {
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
    const opts = { timeout: 30000 }
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
    .split('\n')
    .map(n => n.trim())
    .filter(n => n)
    .join('\n')
}

function print (name, color, str) {
  if (!PRINT_ENABLED) return
  console.log(chalk[color]('[' + name + ']'))
  console.log(str)
  console.log(chalk[color]('[/' + name + ']'))
}
