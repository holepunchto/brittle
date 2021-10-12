import test from '../../index.js'

test('plan must be positive', async ({ plan, pass }) => {
  plan(-1)
  pass()
})
