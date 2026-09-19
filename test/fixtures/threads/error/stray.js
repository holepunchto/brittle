const test = require('../../../../')

test('stray', async (t) => {
  setTimeout(() => {
    throw new Error('STRAY')
  }, 10)
  await new Promise((resolve) => setTimeout(resolve, 10))
  t.pass()
})

test('after stray', (t) => {
  t.pass()
})
