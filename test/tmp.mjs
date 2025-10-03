import fs from 'fs'
import { tester } from './helpers/index.js'

await tester(
  'tmp',
  async function (t) {
    const tmp = await t.tmp()
    t.teardown(
      () => {
        if (fs.existsSync(tmp))
          throw new Error(
            'tmp folder ' + tmp + 'should no longer exist but it does'
          )
      },
      { order: Infinity }
    )
    t.ok(fs.existsSync(tmp), 'passed')
  },
  `
TAP version 13

# tmp
    ok 1 - passed
ok 1 - tmp # time = 0.610103ms

1..1
# tests = 1/1 pass
# asserts = 1/1 pass
# time = 3.531545ms

# ok
  `,
  { exitCode: 0, stderr: '' }
)
