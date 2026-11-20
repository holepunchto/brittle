const test = require('../../../../')

test.hook('queued hook', (t) => {
  console.log('queued job started')
  t.pass()
})
