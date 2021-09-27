import test, { configure } from '../../index.js'

configure({bail: true})

test('success', async ({ pass }) => pass())

test('fail', async ({ fail }) => fail())

test('success again', async ({ pass }) => pass())