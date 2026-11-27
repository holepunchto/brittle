/* global gc */
const test = require('../../../')

test('gc is exposed when mining', (t) => {
  gc()
  t.fail('stop mining')
})
