import { promisify } from 'util'
import test, { configure } from '../../index.js'

const timeout = promisify(setTimeout)

configure({ concurrency: 2 }) 

test('test one', async function ({ pass }) { 
  await timeout(400)
  pass()
})

test('test two', async function ({ pass }) { 
  await timeout(400)
  pass()
})

test('test three', async function ({ pass }) { 
  await timeout(300)
  pass()
})