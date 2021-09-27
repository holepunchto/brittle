import test from '../../index.js'

test('success', async ({ pass }) => pass())

test('fail', async ({ fail }) => fail())

test('success again', async ({ pass }) => pass())