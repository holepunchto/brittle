const test = require('../../../../')

test('before exit', (t) => {
  t.pass()
})

test('exit', () => {
  global.Bare.exit()
})

test('after exit', (t) => {
  t.pass()
})
