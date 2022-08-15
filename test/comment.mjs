import { tester, spawner } from './helpers/index.js'

// + Should add a feature in spawner to also check the comments for tap outputs

await tester('classic comment',
  function (t) {
    t.pass()
    t.comment('here is a comment')
  },
  `
  TAP version 13

  # classic comment
      ok 1 - passed
      # here is a comment
  ok 1 - classic comment # time = 0.68674ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.545492ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('classic comment after classic child',
  function (t) {
    t.pass()
    t.test('child', async (child) => { child.pass() })
    t.comment('here is a comment')
  },
  `
  TAP version 13

  # classic comment after classic child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a comment
  ok 1 - classic comment after classic child # time = 0.742369ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.669677ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('classic comment after inverted child',
  function (t) {
    t.pass()
    const child = t.test('child')
    child.pass()
    t.comment('here is a comment')
    child.end()
  },
  `
  TAP version 13

  # classic comment after inverted child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a comment
  ok 1 - classic comment after inverted child # time = 0.728261ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.635909ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('classic comment inside classic child',
  function (t) {
    t.pass()
    t.test('child', function (child) {
      child.pass()
      child.comment('here is a child comment')
    })
  },
  `
  TAP version 13

  # classic comment inside classic child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a child comment
  ok 1 - classic comment inside classic child # time = 0.743901ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.647675ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('classic comment on inverted child',
  function (t) {
    t.pass()
    const child = t.test('child')
    child.pass()
    child.comment('here is a child comment')
    child.end()
  },
  `
  TAP version 13

  # classic comment on inverted child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a child comment
  ok 1 - classic comment on inverted child # time = 0.724892ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.576397ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted comment')
    t.pass()
    t.comment('here is a comment')
    t.end()
  },
  `
  TAP version 13

  # inverted comment
      ok 1 - passed
      # here is a comment
  ok 1 - inverted comment # time = 0.723792ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.144094ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted comment after classic child')
    t.pass()
    t.test('child', async (child) => { child.pass() })
    t.comment('here is a comment')
    t.end()
  },
  `
  TAP version 13

  # inverted comment after classic child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a comment
  ok 1 - inverted comment after classic child # time = 1.1016ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.324799ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted comment after inverted child')
    t.pass()
    const child = t.test('child')
    child.pass()
    t.comment('here is a comment')
    child.end()
    t.end()
  },
  `
  TAP version 13

  # inverted comment after inverted child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a comment
  ok 1 - inverted comment after inverted child # time = 0.781687ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.164115ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted comment inside classic child')
    t.pass()

    const child = t.test('child')
    child.pass()
    child.comment('here is a child comment')
    child.end()

    t.end()
  },
  `
  TAP version 13

  # inverted comment inside classic child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a child comment
  ok 1 - inverted comment inside classic child # time = 0.844898ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.253084ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function (test) {
    const t = test('inverted comment on inverted child')
    t.pass()

    const child = t.test('child')
    child.pass()
    child.comment('here is a child comment')
    child.end()

    t.end()
  },
  `
  TAP version 13

  # inverted comment on inverted child
      ok 1 - passed
      ok 2 - (child) - passed
      # here is a child comment
  ok 1 - inverted comment on inverted child # time = 0.784698ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 3.217743ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
