/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/index.test.js TAP classic fail > must match snapshot 1`] = `
Object {
  "code": 0,
  "stderr": "",
  "stdout": String(
    TAP version 13
    # classic, no plan
        not ok 1 - failed
          ---
          operator: fail
          at:
            line: 4
            column: 3
            file: file:///classic-fail.js
          source: |
            test('classic, no plan', async ({ fail }) => {
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:4:3
            /index.js:425:24
            Promise.test (/index.js:429:9)
            test/fixtures/classic-fail.js:3:1
            ModuleJob.run (internal/modules/esm/module_job.js:170:25)
            async Loader.import (internal/modules/esm/loader.js:178:24)
            async Object.loadESM (internal/process/esm_loader.js:68:5)
          ...
    
        1..1
    not ok 1 - classic, no plan # time=1.3371337ms
    
    # classic, with plan
        1..1
        not ok 1 - failed
          ---
          operator: fail
          at:
            line: 9
            column: 3
            file: file:///classic-fail.js
          source: |2
              plan(1)
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:9:3
            /index.js:425:24
            Promise.test (/index.js:429:9)
            test/fixtures/classic-fail.js:7:1
            ModuleJob.run (internal/modules/esm/module_job.js:170:25)
            async Loader.import (internal/modules/esm/loader.js:178:24)
            async Object.loadESM (internal/process/esm_loader.js:68:5)
          ...
    
    not ok 2 - classic, with plan # time=1.3371337ms
    
    1..2
    # time=1.3371337ms
    
  ),
}
`

exports[`test/index.test.js TAP classic pass > must match snapshot 1`] = `
Object {
  "code": 0,
  "stderr": "",
  "stdout": String(
    TAP version 13
    # classic, no plan
        ok 1 - passed
        1..1
    ok 1 - classic, no plan # time=1.3371337ms
    
    # classic, plan
        1..1
        ok 1 - passed
    ok 2 - classic, plan # time=1.3371337ms
    
    1..2
    # time=1.3371337ms
    
  ),
}
`
