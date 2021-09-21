import test from '../../index.js'

test('generic', async ({ pass }) => {
  pass()
  throw Error('check')
})

test('premature end', async ({ plan, pass, end }) => {
  plan(2)
  pass()
  end()
})

test('count exceeds plan', async ({ plan, pass }) => {
  plan(1)
  pass()
  pass()
})

{
  const { plan, pass, end } = test('premature end')
  plan(2)
  pass()
  end()
}

{
  const { plan, pass } = test('count exceeds plan')
  plan(1)
  pass()
  pass()
}
