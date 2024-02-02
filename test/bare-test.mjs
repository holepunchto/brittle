import test from '../index.js'
import { IS_BARE } from '../lib/constants.js'

let runtime
let spawn

test('setup', async t => {
  if (IS_BARE) {
    const subprocess = await import('bare-subprocess')
    runtime = 'bare'
    spawn = subprocess.spawn
  } else {
    const cp = await import('child_process')
    runtime = 'node'
    spawn = cp.spawn
  }
})

test('running bare script fails as intended', async t => {
  t.plan(4)
  const { exitCode, error, stdout, stderr } = await executeCode('./test/helpers/bare-test-script.js')
  t.is(exitCode, 1) // 1 for 'node, 0 for 'bare'
  t.absent(error)
  t.ok(stderr.includes('assertion count (0) did not reach plan (1)'))
  t.ok(stdout.includes('test should fail')) // Name of the test, stored in ./helpers/bare-test-script.js
})

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
