import { spawner } from './helpers/index.js'

await spawner(
  function (test) {
    let count = 0

    test('async teardown', function (t) {
      const intervalId = setInterval(() => {}, 500)

      t.is(count++, 0)

      t.teardown(async function () {
        clearInterval(intervalId)

        await new Promise((resolve) => {
          setTimeout(resolve, 100)
        })
        if (count++ !== 1) throw new Error('Different order detected')
      })
    })

    test('sync teardown', function (t) {
      t.is(count++, 2)
      t.teardown(function () {
        if (count++ !== 4) throw new Error('Different order detected')
      })
      t.is(count++, 3)
    })

    test('checking order', function (t) {
      t.is(count++, 5)
    })

    test('plan with teardown', function (t) {
      t.plan(2)

      t.is(count++, 6)
      setTimeout(() => t.is(count++, 7), 100)

      t.teardown(function () {
        if (count++ !== 8) throw new Error('Different order detected')
      })
    })

    test('child teardown', function (t) {
      const child = t.test('child')

      child.is(count++, 9)
      setTimeout(() => child.end(), 100)

      child.teardown(function () {
        if (count++ !== 10) throw new Error('Different order detected')
      })
    })
  },
  `
  TAP version 13

  # async teardown
      ok 1 - should be equal
  ok 1 - async teardown # time = 102.386659ms

  # sync teardown
      ok 1 - should be equal
      ok 2 - should be equal
  ok 2 - sync teardown # time = 1.117214ms

  # checking order
      ok 1 - should be equal
  ok 3 - checking order # time = 0.325406ms

  # plan with teardown
      ok 1 - should be equal
      ok 2 - should be equal
  ok 4 - plan with teardown # time = 101.757178ms

  # child teardown
      ok 1 - (child) - should be equal
  ok 5 - child teardown # time = 100.73231ms

  1..5
  # tests = 5/5 pass
  # asserts = 7/7 pass
  # time = 312.782205ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
