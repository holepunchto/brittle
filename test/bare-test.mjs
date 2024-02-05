import { IS_BARE, IS_NODE } from '../lib/constants.js'
import { spawn } from 'child_process'

const chalk = !IS_BARE && await import('chalk').then(m => m.default)
const runtime = IS_BARE ? 'bare' : 'node'

let didTestError = false

const { exitCode, error, stdout, stderr } = await executeCode('./test/helpers/bare-test-script.js')
if (!is(IS_BARE ? 0 : 1, exitCode)) fnError('wrong exitcode', IS_BARE ? 0 : 1, exitCode)
if (!absent(error)) fnError('error is there')
if (!ok(stderr.includes('assertion count (0) did not reach plan (1)'))) fnError('should include assertion count')
if (!ok(stdout.includes('test should fail'))) fnError('wrong test name') // Name of the test, stored in ./helpers/bare-test-script.js

if (didTestError) {
  if (IS_BARE) global.Bare.exitCode = 1
  if (IS_NODE) process.exitCode = 1
}

function fnError (err, expected, actual) {
  didTestError = true

  console.error(redBold('Error:'), err)

  if (actual || expected) {
    console.error(red('[actual]'))
    console.error(actual)
    console.error(red('[expected'))
    console.error(expected)
  }
}

function red (str) {
  return IS_BARE
    ? str
    : chalk.red(str)
}

function redBold (str) {
  return IS_BARE
    ? str
    : chalk.red.bold(str)
}

// This is a modified version of executeCode() in test/helpers/index.js to support `bare.
// The reason is that the passed code to `bare --eval` does not seem able to require modules from relative paths
async function executeCode (scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(runtime, [scriptPath])

    let exitCode
    let stdout = ''
    let stderr = ''

    child.on('exit', function (code) {
      exitCode = code
      resolve({ exitCode, stdout, stderr })
    })

    child.on('close', function () {
      resolve({ exitCode, stdout, stderr })
    })

    child.on('error', function (error) {
      resolve({ exitCode, error, stdout, stderr })
    })

    child.stdout.on('data', function (chunk) {
      stdout += chunk.toString()
    })
    child.stderr.on('data', function (chunk) {
      stderr += chunk.toString()
    })
  })
}

function is (expected, actual) {
  return expected === actual
}

function absent (arg) {
  return !arg
}

function ok (arg) {
  return !!arg
}
