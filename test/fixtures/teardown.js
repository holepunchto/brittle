import { promisify } from 'util'
import test from '../../index.js'

const sleep = promisify(setTimeout)

test('teardown classic', async ({ pass, teardown }) => {
  teardown(async () => {
    await sleep(200)
    console.log('# TEARDOWN SUCCESSFUL (classic) \n')
  })
  pass()
  await sleep(10)
})

await test('teardown order option', async ({ pass, teardown }) => {
  teardown(async function B () {
    console.log('# TEARDOWN B \n')
  })
  teardown(async function C () {
    console.log('# TEARDOWN C \n')
  }, { order: -Infinity })
  teardown(async function A () {
    console.log('# TEARDOWN A \n')
  }, { order: Infinity })
  pass()
  await sleep(220)
})

{
  const assert = test('teardown inverted')
  assert.teardown(async () => {
    await sleep(300)
    console.log('# TEARDOWN SUCCESSFUL (inverted) \n')
  })
  assert.pass()
  await sleep(10)
  await assert.end()
}

test('teardown after error classic', async ({ teardown, plan }) => {
  teardown(async () => {
    await sleep(400)
    console.log('# TEARDOWN AFTER ERROR SUCCESSFUL (classic) \n')
  })
  throw Error('test')

})

test('teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan', (assert) => {
  const i = setInterval(function () {}, 1000)

  assert.teardown(async () => {
    clearInterval(i)
  })

  assert.plan(1)
  
  const s = assert.test()

  s.plan(1)
  s.pass()
})

