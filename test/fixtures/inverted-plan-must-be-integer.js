import test from '../../index.js'

const assert = test('plan must be integer')
assert.plan('x')
await assert.end()
