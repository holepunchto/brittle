const brittle = require('../../../../')

brittle.configure({ jobs: 2, failuresLast: true })
brittle.pause()

Promise.all([
  brittle.load(require.resolve('./alpha.js')),
  brittle.load(require.resolve('./beta.js'))
]).then(() => brittle.resume())
