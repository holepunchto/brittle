import { spawner } from './helpers/index.js'

await spawner(
  function ({ configure, test }) {
    configure({ coverage: true })

    test('nested stealth bails on first failure', function (t) {
      t.pass('prints here')
      t.pass('also prints here')
    })
  },
  `
  TAP version 13

  # nested stealth bails on first failure
      ok 1 - prints here
      ok 2 - also prints here
  ok 1 - nested stealth bails on first failure # time = 0.295115ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 18.422843ms

  # ok
  -------------------|---------|----------|---------|---------|-------------------
  File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
  -------------------|---------|----------|---------|---------|-------------------
   All files         |   93.45 |    47.06 |   96.30 |   93.45 |                   
    .                |   93.45 |    47.06 |   96.30 |   93.45 |                   
     index.js        |   93.45 |    47.06 |   96.30 |   93.45 | …,684-686,825     
  -------------------|---------|----------|---------|---------|-------------------
  `,
  { exitCode: 0, stderr: '' }
)
