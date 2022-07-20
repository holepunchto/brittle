const test = require('./')

test.skip('hello world', function (t) {
  const a = t.test('a')
  a.timeout(100)
  a.plan(1)
  setTimeout(() => {
    a.pass('pass')
  }, 1000)

  const b = t.test('b')
  b.pass('pass')
  setTimeout(() => {
    b.end()
  }, 1100)

  t.plan(2)
  t.pass('yes sir')
  t.pass('super yes')
})

test('another one', function (t) {
  t.plan(2)
  t.pass('yes sir')
  t.pass('super yes')
})

test('another one', async function (t) {
  t.plan(2)
  t.timeout(100)
  t.pass('yes sir')
  t.fail('yes sir')
  // t.end()
  // t.pass('super yes')
  // return new Promise(r => {})
})

test('another one', async function (t) {
  t.teardown(() => {
    t.comment('teardown nu 0')
  }, { order: 1 })

  t.teardown(() => {
    t.comment('teardown nu 1')
    return new Promise(() => {})
  })

  t.not(1, 2, 'no sir')
  t.alike.coercively({ a: 1 }, { a: true })

  // return new Promise(() => {})
  // await t.execution(Promise.reject(new Error('yoyo')))
  // await t.exception(Promise.resolve(new Error('yoyo')))
})
