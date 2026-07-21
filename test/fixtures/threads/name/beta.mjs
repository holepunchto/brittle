import test from '../../../../'

test('network beta', (t) => {
  t.pass('matched in beta')
})

test('storage beta', (t) => {
  t.fail('should not run, not matched by name')
})
