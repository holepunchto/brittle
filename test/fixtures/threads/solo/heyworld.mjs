import test from '../../../../'

test.hook('hey world pre hook', (t) => {
  t.comment('hey world hook')
})

test('hey world pre (should not run)', (t) => {
  t.fail('this should not run at all')
})

test.solo('hey world', (t) => {
  t.plan(3)
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      t.pass('hey world')
    }, i * 100)
  }
})
