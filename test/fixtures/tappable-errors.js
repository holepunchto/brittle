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

test('premature end', async ({ test, comment }) => {
  const { plan, pass, assert } = test('inverted child of premature end')
  plan(2)
  pass()
  await assert
  comment('THIS LINE SHOULD NEVER BE REACHED')
})

test('count exceeds plan', async ({ test }) => {
  const { plan, pass, assert } = test('inverted child of count exceeds plan')
  plan(1)
  pass()
  pass()
  await assert
})

try { 
  const { plan, pass, assert  } = test('inverted adult')
  plan(2)
  pass()
  await assert
  console.log('THIS LOG SHOULD NEVER OUTPUT')
} catch {}