// This script is used as a test case with the `bare` runtime.
// It is stored as a file, instead of generated, because the passed code to
// `bare --eval` does not seem able to require modules from relative paths
const test = require('../../index.js')

const _fn = t => t.plan(1)

test('test should fail', _fn)
