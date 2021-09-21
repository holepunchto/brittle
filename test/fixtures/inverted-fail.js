import test from '../../index.js'

const assert = test('inverted') 
assert.fail()
await assert.end()
