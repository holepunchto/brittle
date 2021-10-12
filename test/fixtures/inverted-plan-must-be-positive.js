import test from '../../index.js'

const assert = test('plan must be integer')
assert.plan(-1)
assert.pass()
await assert.end()
