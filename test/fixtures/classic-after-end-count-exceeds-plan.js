import test from '../../index.js'

test('count exceeds plan after end', async ({ plan, pass, end }) => {
  plan(1)
  pass()
  await end()
  pass()
})
