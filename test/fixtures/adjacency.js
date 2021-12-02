import test from '../../index.js'
 
test('trailing adjacent awaits', async (assert) => {
  const big = assert.test('big test A')
  const little = assert.test('little test A')

  big.plan(2)
  little.plan(1)

  little.pass('little passed')
  big.pass('big passed')

  

  big.pass('big pass again')

  await little
  await big

})

test('interuptive adjacent awaits', async (assert) => {

  const big = assert.test('big test B')
  const little = assert.test('little test B')

  big.plan(2)
  little.plan(1)

  little.pass('little passed')
  big.pass('big passed')

  await little

  big.pass('big pass again')
  
  await big

})

test('deadlocking adjacent awaits', async (assert) => {

  const big = assert.test('big test C')
  const little = assert.test('little test C')

  big.plan(2)
  little.plan(1)

  little.pass('little passed')
  big.pass('big passed')

  await big

  big.pass('big pass again')
  
  await little

})


