const path = require('path')
const { spawn } = require('child_process')
const chalk = require('chalk')

const PRINT_ENABLED = false
const pkg = JSON.stringify(path.join(__dirname, '..', '..', 'index.js'))

module.exports = { tester, spawner, standardizeTap }

async function tester (name, fn, expected, expectedMore = {}) {
  name = JSON.stringify(name)

  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\ntest(${name}, _fn)`
  print('tester', 'yellow', script)
  return executeTap(script, expected, expectedMore)
}

async function spawner (fn, expected, expectedMore = {}) {
  const script = `const test = require(${pkg})\n\nconst _fn = (${fn.toString()})\n\n_fn(test)`
  print('spawner', 'yellow', script)
  return executeTap(script, expected, expectedMore)
}

async function executeTap (script, expected, expectedMore = {}) {
  const { exitCode, error, stdout, stderr } = await executeCode(script)
  const errors = []
  let tapout
  let tapexp

  if (expectedMore.exitCode !== undefined && exitCode !== expectedMore.exitCode) {
    errors.push({ error: new Error('exitCode is not the expected'), actual: exitCode, expected: expectedMore.exitCode })
  }

  if (error) errors.push({ error })
  if (stderr) errors.push({ error: new Error(stderr) })

  if (!error && !stderr) {
    tapout = standardizeTap(stdout)
    tapexp = standardizeTap(expected)

    if (tapout !== tapexp) {
      errors.push({ error: new Error('TAP output matches the expected output'), actual: tapout, expected: tapexp })
    }

    print('stdout', 'green', stdout)
    print('tapout', 'magenta', tapout)
    print('tapexp', 'cyan', tapexp)
  }

  if (errors.length) {
    process.exitCode = 1

    for (const err of errors) {
      console.error(chalk.red.bold('Error:'), err.error.message)

      if (Object.hasOwn(err, 'actual') || Object.hasOwn(err, 'expected')) {
        console.error(chalk.red('[actual]'), err.actual)
        console.error(chalk.red('[expected]'), err.expected)
      }
    }
  }

  return { errors, exitCode, stdout, tapout, tapexp, stderr }
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

    child.on('close', function (code) {
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
