/* global gc */
const test = require('../../../')

test('hangs until stopped', (t) => {
  t.plan(1)
  gc()
  t.comment('ready')
  const timer = setTimeout(() => t.pass(), 30000)
  t.teardown(() => clearTimeout(timer))
})
