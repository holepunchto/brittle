import { tester } from './helpers/index.js'

await tester(
  'afterEach classic',
  async function (t) {
    t.test(async function describe (t) {
      t.afterEach(async function () {
        console.log('[spawner tester] afterEach classic is called')
        await new Promise((resolve) => {
          setTimeout(resolve, 200)
        })
        console.log('[spawner tester] afterEach classic successful')
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

  # afterEach classic
      ok 1 - passed
  [spawner tester] end of test function
  [spawner tester] afterEach classic is called
  [spawner tester] afterEach classic successful
  ok 1 - afterEach classic # time = 214.155625ms

  1..1
  # tests = 1/1 pass
  # asserts = 1/1 pass
  # time = 217.490625ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
