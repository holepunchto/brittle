const test = require('../../../../')

test('lingering', { timeout: 10 }, async () => {
  setInterval(() => {}, 1000)
  await new Promise(() => {})
})
