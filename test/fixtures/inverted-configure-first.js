import { test, configure } from '../../index.js'

const assert = test('a test')
assert.pass()
await assert.end()

configure({})