import { test, configure } from '../../index.js'
configure({ output: 2 })

test('configure: output', async function ({ pass }) {
  pass()
})