/* global gc */
const test = require('../../../')

test('preload ran and gc is exposed', (t) => {
  gc()
  t.ok(globalThis.preloaded)
})
