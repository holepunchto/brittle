import test from '../../index.js'

test('classic, no plan', async ({ pass }) => {
  pass()
})

test('classic, plan', async ({ pass, plan }) => {
  plan(1)
  pass()
})
