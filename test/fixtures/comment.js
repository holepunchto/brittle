import test from '../../index.js'

test('classic comment', async ({ pass, comment }) => {
  pass()
  comment('here is a comment')
})

test('classic comment after classic child', async ({ pass, comment, test }) => {
  pass()
  test('child', async ({ pass }) => { pass() })
  comment('here is a comment, it will print before child asserts')
})

test('classic comment after inverted child', async ({ pass, comment, test }) => {
  pass()
  const assert = test('child')
  assert.pass()
  comment('here is a comment, it will print before child asserts')
  assert.end()
})

test('classic comment inside classic child', async ({ pass, test }) => {
  pass()
  test('child', async ({ pass, comment }) => {
    pass()
    comment('here is a child comment')
  })
})

test('classic comment on inverted child', async ({ pass, test }) => {
  pass()
  const assert = test('child')
  assert.pass()
  assert.comment('here is a child comment')
  await assert.end()
})


{
  const { end, pass, comment } = test('inverted comment')
  pass()
  comment('here is a comment')
  await end()
}
{
  const { end, pass, comment, assert } = test('inverted comment after classic child')
  pass()
  assert.test('child', async ({ pass }) => { pass() })
  comment('here is a comment, it will print before child asserts')
  await end()
}

{
  const { end, pass, comment, assert } = test('inverted comment after inverted child')
  pass()
  const child = assert.test('child')
  child.pass()
  comment('here is a comment, it will print before child asserts')
  await child.end()
  await end()
}
{
 const { end, pass, assert } = test('inverted comment inside classic child')
  pass()
  {
    const { end, pass, comment } = assert.test('child')
    pass()
    comment('here is a child comment')
    await end()
  }
  await end()
}
{
  const { end, pass, assert } = test('inverted comment on inverted child')
  pass()
  const child = assert.test('child')
  child.pass()
  child.comment('here is a child comment')
  await child.end()
  await end()
}