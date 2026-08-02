const test = require('../../../')

test('passing', (t) => {
  t.plan(2)
  t.pass('a passing assertion')
  t.is(1, 1, 'one is one')
})

test('skipped', { skip: true }, (t) => {
  t.pass()
})

test('todo', { todo: true }, (t) => {
  t.pass()
})

test('nested', (t) => {
  t.plan(1)
  t.test('child', (child) => {
    child.plan(1)
    child.comment('a nested comment')
    child.pass('a nested assertion')
  })
})

test('failing', (t) => {
  t.plan(1)
  t.comment('about to fail')
  t.is(1, 2, 'one is two')
})
