import { promisify } from 'util'
import test from '../../index.js'

const sleep = promisify(setTimeout)

test('timeout option, classic, no plan', {timeout: 10}, async () => {
  await sleep(20)
})

try {
  const assert = test('timeout option, inverted, no plan', {timeout: 10})
  await sleep(20)
  await assert.end()
} catch {}

test('timeout option, classic, plan', {timeout: 10}, async ({ plan }) => {
  plan(1)
  await sleep(20)
})

try {
  const assert = test('timeout option, inverted, plan', {timeout: 10})
  assert.plan(1)
  await sleep(20)
  await assert
} catch {}

test('timeout method, classic, no plan', async ({ timeout }) => {
  timeout(10)
  await sleep(20)
})

try {
  const assert = test('timeout method, inverted, no plan')
  assert.timeout(10)
  await sleep(20)
  await assert.end()
} catch {}

test('timeout method, classic, plan', async ({ plan, timeout }) => {
  timeout(10)
  plan(1)
  await sleep(20)
})


try {
const assert = test('timeout method, inverted, plan')
assert.timeout(10)
assert.plan(1)
await sleep(20)
await assert
} catch {}