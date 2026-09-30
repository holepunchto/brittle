const test = require('../../../../')

test('before thrown', (t) => {
  t.pass()
})

test('thrown', { timeout: 10 }, async () => {
  throw new Error('ERROR')
})
