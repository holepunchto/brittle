const test = require('../../../')

test('alpha', (t) => {
  t.plan(2)
  t.pass('a passing assertion')
  t.is(1, 1, 'one is one')
})
