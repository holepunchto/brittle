import test from '../../index.js'

const assert = test('plan must be integer')
assert.plan('x')
assert.pass()
await assert.end()
