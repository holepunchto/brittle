import { promisify } from 'util'
import test from '../../index.js'

const timeout = promisify(setTimeout)

test('test one', async function ({ pass }) { 
  await timeout(400)
  pass()
})

test('test two', async function ({ pass }) { 
  await timeout(200)
  pass()
})

test('test three', async function ({ pass }) { 
  await timeout(100)
  pass()
})


test('test four', async function ({ pass }) { 
  await timeout(100)
  pass()
})


test('test five', async function ({ pass }) { 
  await timeout(300)
  pass()
})


