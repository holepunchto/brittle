import test from '../../index.js'

const { pass, end } = test('assert after end')
pass()
await end()
pass()