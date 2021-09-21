import test from '../../index.js'

test('teardown after end', async ({ pass, teardown, end }) => {
  pass()
  await end()
  teardown(() => {})
})
