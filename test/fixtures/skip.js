import { test, skip } from '../../index.js'

test('run this one', async ({ pass }) => {
  pass()
})

skip('skip this one', async ({ pass }) => {
  pass()
})

test('run this one', async ({ pass }) => {
  pass()
})

const assert = todo()
assert.skip()
await assert.end()