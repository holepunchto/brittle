import { tester } from './helpers/index.js'

await tester('fails on a test without any assertions',
  function (t) {
  },
  `
TAP version 13

# fails on a test without any assertions
not ok 1 - fails on a test without any assertions # time = 1.300587ms
      ---
      No assertions were tested
      ...

1..1
# tests = 0/1 pass
# asserts = 0/0 pass
# time = 17.131802ms

# not ok  `,
  {
    exitCode: 1,
    stderr: ''
  }
)
