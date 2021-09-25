import { test, todo } from '../../index.js'

test('run this one', async ({ pass }) => {
  pass()
})

todo('todo this one', async ({ pass }) => {
  pass()
})

test('run this one', async ({ pass }) => {
  pass()
})

const assert = todo()
assert.pass()
await assert.end()