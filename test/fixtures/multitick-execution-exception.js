import test from '../../index.js'

test('multi-tick execution (promise resolve)', async ({ execution, pass }) => {
  pass('first')
  execution(new Promise((resolve) => setTimeout(()=> resolve(), 100)))
  pass('second')
})


test('multi-tick execution (promise reject)', async ({ execution, pass }) => {
  pass('first')
  execution(new Promise((_, reject) => setTimeout(()=> reject(Error('test')), 100)))
  pass('second')
})

test('multi-tick exception (promise resolve)', async ({ exception, pass }) => {
  pass('first')
  exception(new Promise((resolve) => setTimeout(()=> resolve(), 100)))
  pass('second')
})


test('multi-tick exception (promise reject)', async ({ exception, pass }) => {
  pass('first')
  exception(new Promise((_, reject) => setTimeout(()=> reject(Error('test')), 100)))
  pass('second')
})
