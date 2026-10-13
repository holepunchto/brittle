const test = require('../../../../')

test('timed test', async (t) => {
  console.log('test started')
  await new Promise((resolve) => setTimeout(resolve, 200))
  console.log('test finished')
  t.pass()
})
