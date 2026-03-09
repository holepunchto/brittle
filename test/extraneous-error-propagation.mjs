import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    foo.bar() // eslint-disable-line no-undef
  },
  '',
  { exitCode: global.Bare ? 134 : 1, stderr: { includes: 'ReferenceError: foo is not defined' } }
)
