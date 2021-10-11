import test from '../../index.js'

test('tbd', async ({ execution, comment }) => {
  execution(new Promise((_, reject) => setTimeout(()=> reject(Error('test')), 100)))
  comment('comment should appear after execution assert failure')
})
