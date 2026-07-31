const test = require('../../../')

// flip this to t.pass('beta is fixed') and save while `--watch` is running
test('beta', (t) => {
  t.plan(1)
  t.fail('beta is broken')
})
