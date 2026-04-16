import test from '../../../../'

test.solo('hey world', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('hey world')
    }, i * 100)
  }
})
