import test from '../../index.js'

const { plan, pass, end } = test('count exceeds plan after end')
plan(1)
pass()
await end()
pass()

