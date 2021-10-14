import { test, solo } from '../../index.js'

solo()

test('skip this one', async ({ pass }) => {
  pass()
})

solo('run this one', async ({ pass }) => {
  pass()
})

test('skip this one', async ({ pass }) => {
  pass()
})
