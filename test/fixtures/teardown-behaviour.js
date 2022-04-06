import test from '../../index.js'

test('teardown handle', async ({ pass, teardown }) => {
  pass()
  const i = setInterval(() => {}, 2000)
  teardown(async () => {
    clearInterval(i)
    console.log('# TEARDOWN SUCCESSFUL (classic) \n')
  })
})

test('one', async function (t) {
  console.log('# start 1')
  t.teardown(async function () {
    console.log('# teardown 1')
  })
  t.pass('ok')
})

test('two', async function (t) {
  console.log('# start 2')
  t.pass('ok')
})