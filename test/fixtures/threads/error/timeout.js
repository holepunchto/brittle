const test = require('../../../../')

test('timeout', { timeout: 10 }, async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 100)
  })
})
