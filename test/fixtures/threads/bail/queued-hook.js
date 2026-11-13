const test = require('../../../../')

// Hooks still execute when skipAll is set, exposing jobs started after bailout.
test.hook('queued hook', (t) => {
  console.log('queued job started')
  t.pass()
})
