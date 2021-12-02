import { promisify } from 'util'
import test, { configure } from '../../index.js'

const timeout = promisify(setTimeout)

configure({ serial: true }) // serial mode in this file

test('test one', async function ({ pass }) { 
  await timeout(400)
  pass()
})

test('test two', async function ({ pass }) { 
  await timeout(200)
  pass()
})
