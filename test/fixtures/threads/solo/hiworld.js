const test = require('../../../../')

test.solo('hi world', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('hi world')
    }, i * 100)
  }
})

test('hi world 2 (should not run)', (t) => {
  t.fail('this should not run at all')
})

test.hook('hi world post hook', (t) => {
  t.comment('hi world hook')
})
