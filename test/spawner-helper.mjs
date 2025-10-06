import { tester } from './helpers/index.js'

function testCommentAfterEnd(t) {
  t.plan(1)
  t.is(1, 1)
  setImmediate(() => t.comment('test'))
}

const VALID_TAP_OUTPUT = `TAP version 13

# comment after end
    ok 1 - should be equal
ok 1 - comment after end # time = 0.716469ms`

const WRONG_TAP_OUTPUT = `TAP vErSiOn 13

# comment after end
    ok 1 - sHoUlD bE eQuAl
ok 1 - comment after end # time = 0.716469ms`

const VALID_STDERR = { includes: "Can't comment after end" }
const WRONG_STDERR = { includes: '7h1s i$ th3 wr0ng m3ss4g3' }

const VALID_EXITCODE = 0
const WRONG_EXITCODE = 1

const failOnSuccess = () => {
  throw new Error('Should not have succeed')
}

// expected stdout is required and that's a string
const catchMissingStdout = (error) => {
  if (error.message !== 'Expected stdout is required as a string') throw error
}
await tester('stdout is required', testCommentAfterEnd)
  .then(failOnSuccess)
  .catch(catchMissingStdout)
await tester('stdout must be a string', testCommentAfterEnd, true)
  .then(failOnSuccess)
  .catch(catchMissingStdout)

// expected stderr is required
const catchMissingStderr = (error) => {
  if (error.message !== 'Expected stderr is required') throw error
}
await tester('basic', function (t) {}, '')
  .then(failOnSuccess)
  .catch(catchMissingStderr)
await tester('basic', function (t) {}, '', { stderr: undefined })
  .then(failOnSuccess)
  .catch(catchMissingStderr)
await tester('basic', function (t) {}, '', { stderr: {} })
  .then(failOnSuccess)
  .catch(catchMissingStderr)

const catchMissingStderrIncludes = (error) => {
  if (error.message !== 'Expected stderr.includes can not be empty') throw error
}
await tester('basic', function (t) {}, '', { stderr: { includes: '' } })
  .then(failOnSuccess)
  .catch(catchMissingStderrIncludes)

// ensure exit code
const results1 = await tester('comment after end', testCommentAfterEnd, VALID_TAP_OUTPUT, {
  stderr: VALID_STDERR,
  exitCode: VALID_EXITCODE,
  _silent: true
})
alike(results1, ['EXIT_CODE_MISMATCH'], 'There should only be a exit code mismatch')

// ensure stderr validation
const results2 = await tester('comment after end', testCommentAfterEnd, VALID_TAP_OUTPUT, {
  stderr: WRONG_STDERR,
  exitCode: WRONG_EXITCODE,
  _silent: true
})
alike(results2, ['STDERR_VALIDATION'], 'There should be only a stderr validation')

// ensure stdout match
const results3 = await tester('comment after end', testCommentAfterEnd, WRONG_TAP_OUTPUT, {
  stderr: VALID_STDERR,
  exitCode: WRONG_EXITCODE,
  _silent: true
})
alike(results3, ['TAP_MISMATCH'], 'There should be only a tap mismatch')

// ensure when all wrong at the same time
const results4 = await tester('comment after end', testCommentAfterEnd, WRONG_TAP_OUTPUT, {
  stderr: WRONG_STDERR,
  exitCode: VALID_EXITCODE,
  _silent: true
})
alike(
  results4,
  ['EXIT_CODE_MISMATCH', 'STDERR_VALIDATION', 'TAP_MISMATCH'],
  'There should only be a exit code mismatch'
)

// ensure all good at the same time
const results5 = await tester('comment after end', testCommentAfterEnd, VALID_TAP_OUTPUT, {
  stderr: VALID_STDERR,
  exitCode: WRONG_EXITCODE,
  _silent: true
})
alike(results5, [], 'There should be no errors')

// helpers
function alike(results, expected, message) {
  const actual = results.errors.map((e) => e.type)
  const match = JSON.stringify(actual) === JSON.stringify(expected)
  if (!match) {
    console.error(results.errors)
    throw new Error(message)
  }
}
