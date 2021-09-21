import test from '../../index.js'

test('classic, no plan', async ({ fail }) => {
  fail()
})

test('classic, with plan', async ({ fail, plan }) => {
  plan(1)
  fail()
})
