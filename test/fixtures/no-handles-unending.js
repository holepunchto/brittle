import test from '../../index.js'

// https://github.com/davidmarkclements/brittle/issues/8

test('never resolve', {timeout: 100}, async function (t) {
  await new Promise((resolve) => {}) // never resolves
  // t.pass('a')
})