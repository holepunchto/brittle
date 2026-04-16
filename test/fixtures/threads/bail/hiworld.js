const test = require('../../../../')

test('hi world', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('hi world')
    }, i * 10)
  }
})

test('after hi world (should not run)', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('after hi world')
    }, i * 10)
  }
})
