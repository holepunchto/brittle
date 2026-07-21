const test = require('../../../../')

test('network alpha', (t) => {
  t.pass('matched in alpha')
})

test('database alpha', (t) => {
  t.fail('should not run, not matched by name')
})
