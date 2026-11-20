const test = require('../../../../')

test('should not start', (t) => {
  t.pass()
})

setTimeout(() => {
  throw new Error('before start')
}, 50)
