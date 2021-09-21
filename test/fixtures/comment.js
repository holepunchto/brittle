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

test('classic comment inside classic child', async ({ pass, comment, test }) => {
  pass()
  test('child', async ({ pass, comment }) => {
    pass()
    comment('here is a child comment')
  })
})

test('classic comment on inverted child', async ({ pass, comment, test }) => {
  pass()
  const assert = test('child')
  assert.pass()
  assert.comment('here is a child comment')
})
