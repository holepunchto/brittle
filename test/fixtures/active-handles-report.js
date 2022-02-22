import test from '../../index.js'

test('active handles report on SIGINT', async ({ pass }) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 10000)
  })
  pass()
})


