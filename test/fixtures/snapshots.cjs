'use strict'
const test = require('../../index.js')

const { TEST_VALUE = '1337' } = process.env

test('classic snapshot', async ({ snapshot }) => {
  snapshot(TEST_VALUE)
})

const assert = test('inverted snapshot')
assert.snapshot(TEST_VALUE)
await assert.end()


test('snapshot of a symbol', async ({ snapshot }) => {
  snapshot(Symbol(TEST_VALUE))
})

test('snapshot of an Error', async ({ snapshot }) => {
  snapshot(new Error(TEST_VALUE))
})

test('snapshot of undefined', async ({ snapshot }) => {
  snapshot(undefined)
})

test('snapshot of null', async ({ snapshot }) => {
  snapshot(null)
})

test('snapshot of number', async ({ snapshot }) => {
  snapshot(+TEST_VALUE)
})

test('snapshot of an object', async ({ snapshot }) => {
  snapshot({ value: TEST_VALUE, more: {nesting: 'props'}})
})

test('multiple snapshots', async ({ snapshot }) => {
  snapshot(TEST_VALUE)
  snapshot({value: TEST_VALUE})
})

test('child snapshot', async ({ test }) => {
  const assert = test('the child')
  assert.snapshot(TEST_VALUE)
  await assert.end()
})