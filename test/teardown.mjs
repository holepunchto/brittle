import { tester, spawner } from './helpers/index.js'

await tester('teardown classic',
  async function (t) {
    t.teardown(async function () {
      console.log('[spawner tester] teardown classic is called')
      await new Promise((resolve) => { setTimeout(resolve, 200) })
      console.log('[spawner tester] teardown classic successful')
    })

    t.pass()
    await new Promise((resolve) => { setTimeout(resolve, 10) })

    console.log('[spawner tester] end of test function')
  },
  `
  TAP version 13

  # teardown classic
      ok 1 - passed
  [spawner tester] end of test function
  [spawner tester] teardown classic is called
  [spawner tester] teardown classic successful
  ok 1 - teardown classic # time = 212.699882ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 216.664572ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test('teardown inverted')

    t.teardown(async function () {
      console.log('[spawner tester] teardown inverted is called')
      await new Promise((resolve) => { setTimeout(resolve, 200) })
      console.log('[spawner tester] teardown inverted successful')
    })

    t.pass()
    await new Promise((resolve) => { setTimeout(resolve, 10) })
    console.log('[spawner tester] before calling t.end()')
    t.end()

    console.log('[spawner tester] end of test function')
  },
  `
  TAP version 13

  # teardown inverted
      ok 1 - passed
  [spawner tester] before calling t.end()
  [spawner tester] teardown inverted is called
  [spawner tester] end of test function
      # ...teardown still running after 250ms
  [spawner tester] teardown inverted successful
      # ...teardown time 301.126046ms
  ok 1 - teardown inverted # time = 312.980566ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 316.656054ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('teardown order option',
  async function (t) {
    t.teardown(function () {
      console.log('[spawner tester] teardown B')
    })

    t.teardown(function () {
      console.log('[spawner tester] teardown C')
    }, { order: Infinity })

    t.teardown(function () {
      console.log('[spawner tester] teardown A')
    }, { order: -Infinity })

    t.pass()
    await new Promise((resolve) => { setTimeout(resolve, 200) })

    console.log('[spawner tester] end of test function')
  },
  `
  TAP version 13

  # teardown order option
      ok 1 - passed
  [spawner tester] end of test function
  [spawner tester] teardown A
  [spawner tester] teardown B
  [spawner tester] teardown C
  ok 1 - teardown order option # time = 224.370336ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 228.787503ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester('teardown after error classic',
  function (t) {
    t.teardown(async function () {
      await new Promise((resolve) => { setTimeout(resolve, 200) })
      console.log('[spawner tester] async teardown after error successful (classic)')
    })

    throw Error('test')
  },
  `
  TAP version 13

  # teardown after error classic
  `,
  {
    stderr: { includes: 'Error: test' },
    exitCode: 1
  }
)

await tester('teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan',
  function (t) {
    const intervalId = setInterval(function () {}, 500)

    t.teardown(function () {
      clearInterval(intervalId)
      console.log('[spawner tester] teardown of parent successful')
    })

    t.plan(1)

    const s = t.test()
    s.plan(1)
    s.pass()

    console.log('[spawner tester] end of test function')
  },
  `
  TAP version 13

  # teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan
      ok 1 - passed
  [spawner tester] end of test function
  [spawner tester] teardown of parent successful
  ok 1 - teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan # time = 0.97601ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 3.961503ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
