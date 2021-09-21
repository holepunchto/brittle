import { promisify } from 'util'
import test from '../../index.js'

const sleep = promisify(setTimeout)

test('teardown classic', async ({ pass, teardown }) => {
  teardown(async () => {
    await sleep(10)
    console.log('# TEARDOWN SUCCESSFUL (classic) \n')
  })
  pass()
  await sleep(10)
})

{
  const assert = test('teardown inverted')
  assert.teardown(async () => {
    await sleep(10)
    console.log('# TEARDOWN SUCCESSFUL (inverted) \n')
  })
  assert.pass()
  await sleep(10)
  await assert.end()
}

test('teardown after error classic', async ({ teardown, plan }) => {
  teardown(async () => {
    await sleep(10)
    console.log('# TEARDOWN AFTER ERROR SUCCESSFUL (classic) \n')
  })
  throw Error('test')

})
