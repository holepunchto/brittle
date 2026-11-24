/* global gc */
const test = require('../../../')

test('gc is exposed', (t) => {
  gc()
  t.pass()
})
