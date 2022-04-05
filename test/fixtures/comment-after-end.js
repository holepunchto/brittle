import test from '../../index.js'

test('comment after end', async ({ plan, is, comment }) => {
  plan(1)
  is(1, 1)
  setImmediate(() => comment('test'))
})