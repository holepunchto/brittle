import test from '../../index.js'

test('plan must be positive', async ({ plan }) => {
  plan(-1)
})
