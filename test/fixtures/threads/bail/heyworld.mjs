import test from '../../../../'

test('failing hey world', (t) => {
  t.fail()
})

test('hey world (should not run)', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('hey world')
    }, i * 100)
  }
})
