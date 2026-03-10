import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    foo.bar() // eslint-disable-line no-undef
  },
  '',
  { exitCode: 'error', stderr: { includes: 'ReferenceError: foo is not defined' } }
)
