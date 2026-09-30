const test = require('../../../../')
const process = require('process')

test('handled', async (t) => {
  const errors = []
  const onerror = (err) => errors.push(err.message)

  global.Bare.on('uncaughtException', onerror)
  process.on('unhandledRejection', onerror)

  setTimeout(() => {
    throw new Error('UNCAUGHT')
  }, 1)
  Promise.reject(new Error('UNHANDLED'))

  await new Promise((resolve) => setTimeout(resolve, 20))

  global.Bare.off('uncaughtException', onerror)
  process.off('unhandledRejection', onerror)

  t.alike(errors.sort(), ['UNCAUGHT', 'UNHANDLED'])
})

test('after handled', (t) => {
  t.pass()
})
