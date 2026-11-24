/* global gc */
const test = require('../../../')

test('gc is exposed in second job', (t) => {
  gc()
  t.pass()
})
