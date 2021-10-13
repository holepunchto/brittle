import { expectType } from 'tsd'
import test, { configure } from '../index.js'

configure({ serial: true })

test('types', async (assert) => {
  expectType<boolean>(await assert.is(true, true))
})
