import { promisify } from 'util'
import test, { configure } from '../../index.js'

const sleep = promisify(setTimeout)

configure({ serial: true })

// https://github.com/davidmarkclements/brittle/issues/9


test('tbd', {timeout: 10}, async ({ pass }) => {
  await sleep(200)
  pass()
})

test('tbd2', {timeout: 10}, async ({ pass }) => {
  pass()
})