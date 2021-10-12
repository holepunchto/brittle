import test from '../../index.js'

test('plan must be integer', async ({ plan, pass }) => {
  plan('x')
  pass()
})
