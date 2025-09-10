import { tester } from './helpers/index.js'

await tester(
  'beforeEach classic',
  async function (t) {
    t.test(async function describe (t) {
      t.beforeEach(async function () {
        console.log('[spawner tester] beforeEach classic is called')
        await new Promise((resolve) => {
          setTimeout(resolve, 200)
        })
        console.log('[spawner tester] beforeEach classic successful')
      })

      t.test(async (t) => {
        t.pass()

        await new Promise((resolve) => {
          setTimeout(resolve, 10)
        })

        console.log('[spawner tester] end of test function')
      })
    })
  },
  `
  TAP version 13

  # beforeEach classic
  [spawner tester] beforeEach classic is called
  [spawner tester] beforeEach classic successful
      ok 1 - passed
  [spawner tester] end of test function
  ok 1 - beforeEach classic # time = 214.155625ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 217.490625ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
