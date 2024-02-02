// This script is used as a test case with the `bare` runtime.
// It is stored as a file, instead of generated, because `bare` does not take code as an argument
const test = require('../../index.js')

const _fn = t => t.plan(1)

test('test should fail', _fn)
