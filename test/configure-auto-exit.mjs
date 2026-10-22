import { spawner } from './helpers/index.js'

await spawner(
  function ({ configure, test }) {
    configure({ autoExit: true })

    test('auto exit prints the summary', function (t) {
      t.pass('prints here')
    })

    setTimeout(function () {
      if (global.Bare) global.Bare.exit()
      else process.exit()
    }, 1000)
  },
  `
  TAP version 13

  # auto exit prints the summary
      ok 1 - prints here
  ok 1 - auto exit prints the summary # time = 0.295115ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 18.422843ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ configure, test }) {
    configure({ autoExit: true })

    test('auto exit prints the summary once', function (t) {
      t.pass('prints here')
    })
  },
  `
  TAP version 13

  # auto exit prints the summary once
      ok 1 - prints here
  ok 1 - auto exit prints the summary once # time = 0.295115ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 18.422843ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ configure, test }) {
    configure({ autoExit: true })

    test('first', function (t) {
      t.pass()
    })

    test('second', function (t) {
      t.pass()
    })

    test('third', function (t) {
      t.pass()
    })
  },
  `
  TAP version 13

  # first
      ok 1 - passed
  ok 1 - first # time = 0.166167ms

  # second
      ok 1 - passed
  ok 2 - second # time = 0.029458ms

  # third
      ok 1 - passed
  ok 3 - third # time = 0.021625ms

  1..3
  # tests = 3/3 pass
  # asserts = 3/3 pass
  # time = 9.471375ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
