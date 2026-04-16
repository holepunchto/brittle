const test = require('../../../')

test('hello world', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('hello world')
    }, i * 10)
  }
})
