import test from '../../index.js'

const assert = test()
assert.pass()
const child =  assert.test()
child.pass()
await child.end()
await assert.end()

test('classic', async (assert) => {
  assert.pass()
  const child =  assert.test()
  child.pass()
  await child.end()
  await assert.end()
})