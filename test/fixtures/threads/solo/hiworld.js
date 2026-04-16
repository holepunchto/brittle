const test = require('../../../../')

test.solo('hi world', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++)
    setTimeout(() => {
      t.pass('hi world')
    }, i * 100)
})
