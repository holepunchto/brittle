import test from '../../index.js'

function f () {
  function x () {
    throw Error('check')
  }
  x()
}

test('generic', async ({ pass }) => {
  pass()
  f()
})

test('premature end', async ({ plan, pass }) => {
  plan(2)
  pass()
})

test('count exceeds plan', async ({ plan, pass }) => {
  plan(1)
  pass()
  pass()
})

{
  const { plan, pass, assert } = test('premature end')
  plan(2)
  pass()
  await assert
}

{
  const { plan, pass, assert } = test('count exceeds plan')
  plan(1)
  pass()
  pass()
  await assert
}
