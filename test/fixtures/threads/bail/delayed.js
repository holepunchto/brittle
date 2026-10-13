const test = require('../../../../')

test('delayed bailout', { timeout: 500 }, async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
})
