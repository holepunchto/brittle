/* global gc */
const test = require('../../../')

test('gc is exposed', (t) => {
  t.is(typeof gc, 'function')
  if (typeof gc === 'function') gc()
})
