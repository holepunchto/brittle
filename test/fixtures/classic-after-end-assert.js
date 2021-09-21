import test from '../../index.js'

test('assert after end', async ({ pass, end }) => {
  pass()
  await end()
  pass()
})
