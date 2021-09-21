import test from '../../index.js'

const { pass, teardown, end } = test('teardown after end')
pass()
await end()
teardown(() => {})