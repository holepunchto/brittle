const test = require('../../../../')

test('thrown', { timeout: 10 }, async () => {
  throw new Error('ERROR')
})
