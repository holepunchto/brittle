exports['no args 1'] = `
[?25l
[43m    [49m
[103m 🥜 [49m [4mBrittle[24m
[43m    [49m
[43m    [49m  brittle [flags] [<files>]
[43m    [49m
[43m    [49m  --help | -h           Show this help
[43m    [49m  --watch | -w          Rerun tests when a file changes
[43m    [49m  --reporter | -R | -r  Set test reporter: [3mtap, spec, dot[23m
[43m    [49m  --bail | -b           Bail out on first assert failure
[43m    [49m  --snap-all            Update all snapshots
[43m    [49m  --snap <name>         Update specific snapshot by name
[43m    [49m  --no-cov              Turn off coverage
[43m    [49m  --100                 Fail if coverage is not 100%  
[43m    [49m  --90                  Fail if coverage is not 90%
[43m    [49m  --85                  Fail if coverage is not 85%
[43m    [49m  --ec | -e             Explore coverage: [3m--cov-report=html[23m
[43m    [49m  --cov-report          Set coverage reporter:
[43m    [49m                        [3mtext, html, text-summary...[23m
[43m    [49m
[103m 🥜 [49m  --cov-help            Show advanced coverage options
[43m    [49m
[43m    [49m

[?25h
`

exports['--help 1'] = `
[?25l
[43m    [49m
[103m 🥜 [49m [4mBrittle[24m
[43m    [49m
[43m    [49m  brittle [flags] [<files>]
[43m    [49m
[43m    [49m  --help | -h           Show this help
[43m    [49m  --watch | -w          Rerun tests when a file changes
[43m    [49m  --reporter | -R | -r  Set test reporter: [3mtap, spec, dot[23m
[43m    [49m  --bail | -b           Bail out on first assert failure
[43m    [49m  --snap-all            Update all snapshots
[43m    [49m  --snap <name>         Update specific snapshot by name
[43m    [49m  --no-cov              Turn off coverage
[43m    [49m  --100                 Fail if coverage is not 100%  
[43m    [49m  --90                  Fail if coverage is not 90%
[43m    [49m  --85                  Fail if coverage is not 85%
[43m    [49m  --ec | -e             Explore coverage: [3m--cov-report=html[23m
[43m    [49m  --cov-report          Set coverage reporter:
[43m    [49m                        [3mtext, html, text-summary...[23m
[43m    [49m
[103m 🥜 [49m  --cov-help            Show advanced coverage options
[43m    [49m
[43m    [49m

[?25h
`

exports['--cov-help 1'] = `
[?25l
[43m    [49m
[103m 🥜 [49m [4mBrittle[24m
[43m    [49m
[43m    [49m  [3mAdditional and all coverage options[23m
[43m    [49m
[43m    [49m  --lines <n>         Fail if line coverage doesn't meet <n>
[43m    [49m  --functions <n>     Fail if function coverage doesn't meet <n>
[43m    [49m  --statements <n>    Fail if statement coverage doesn't meet <n>
[43m    [49m  --branches <n>      Fail if branch coverage doesn't meet <n>
[43m    [49m  --cov-all           Apply coverage to all files, instead of 
[43m    [49m                      only runtime-loaded files
[43m    [49m  --cov-exclude       Exclude files from coverage report
[43m    [49m  --cov-include       Include files in coverage report
[43m    [49m  --cov-dir           Set the coverage output directory: 
[43m    [49m                     [3m<project>/coverage[23m
[43m    [49m  --no-cov-clean      Do not wipe coverage folder before each run
[43m    [49m  --ec | -e           Explore coverage: [3m--cov-report=html[23m
[43m    [49m  --cov-report        Set coverage reporter:
[43m    [49m                      [3mtext, html, text-summary...[23m
[43m    [49m  --100               Fail if coverage is not 100%  
[43m    [49m  --90                Fail if coverage is not 90%
[43m    [49m  --85                Fail if coverage is not 85%
[43m    [49m  --no-cov            Turn off coverage
[43m    [49m
[103m 🥜 [49m  [3mFor more coverage reporters see:[23m
[43m    [49m  ]8;;https://istanbul.js.org/docs/advanced/alternative-reportershttps://istanbul.js.org/docs/advanced/alternative-reporters]8;;
[43m    [49m
[103m 🥜 [49m  [3mFor more information & configuration capabalities see:[23m
[43m    [49m  ]8;;https://github.com/bcoe/c8https://github.com/bcoe/c8]8;;
[43m    [49m

[?25h
`

exports['single passing test 1'] = `
[?25lTAP version 13
# test/fixtures/classic-pass.js
    # classic, no plan
        ok 1 - passed
        1..1
    ok 1 - classic, no plan # time=1.3371337ms
    # classic, plan
        1..1
        ok 1 - passed
    ok 2 - classic, plan # time=1.3371337ms
    # classic, plan w/comment
        1..1 # comment
        ok 1 - passed
    ok 3 - classic, plan w/comment # time=1.3371337ms
    1..3
ok 1 - test/fixtures/classic-pass.js # time=1.3371337ms

1..1
# time=1.3371337ms

[?25h
`

exports['multiple specified passing tests 1'] = `
[?25lTAP version 13
# test/fixtures/classic-pass.js
    # classic, no plan
        ok 1 - passed
        1..1
    ok 1 - classic, no plan # time=1.3371337ms
    # classic, plan
        1..1
        ok 1 - passed
    ok 2 - classic, plan # time=1.3371337ms
    # classic, plan w/comment
        1..1 # comment
        ok 1 - passed
    ok 3 - classic, plan w/comment # time=1.3371337ms
    1..3
ok 1 - test/fixtures/classic-pass.js # time=1.3371337ms

# test/fixtures/inverted-pass.js
    # inverted
        ok 1 - passed
        1..1
    ok 1 - inverted # time=1.3371337ms
    1..1
ok 2 - test/fixtures/inverted-pass.js # time=1.3371337ms

1..2
# time=1.3371337ms

[?25h
`

exports['--help 2'] = `
[?25l
[43m    [49m
[103m 🥜 [49m [4mBrittle[24m
[43m    [49m
[43m    [49m  brittle [flags] [<files>]
[43m    [49m
[43m    [49m  --help | -h           Show this help
[43m    [49m  --watch | -w          Rerun tests when a file changes
[43m    [49m  --reporter | -R | -r  Set test reporter: [3mtap, spec, dot[23m
[43m    [49m  --bail | -b           Bail out on first assert failure
[43m    [49m  --snap-all            Update all snapshots
[43m    [49m  --snap <name>         Update specific snapshot by name
[43m    [49m  --no-cov              Turn off coverage
[43m    [49m  --100                 Fail if coverage is not 100%  
[43m    [49m  --90                  Fail if coverage is not 90%
[43m    [49m  --85                  Fail if coverage is not 85%
[43m    [49m  --ec | -e             Explore coverage: [3m--cov-report=html[23m
[43m    [49m  --cov-report          Set coverage reporter:
[43m    [49m                        [3mtext, html, text-summary...[23m
[43m    [49m
[103m 🥜 [49m  --cov-help            Show advanced coverage options
[43m    [49m
[43m    [49m

[?25h
`

exports['multiple globbed passing tests 1'] = `
[?25lTAP version 13
# test/fixtures/classic-pass.js
    # classic, no plan
        ok 1 - passed
        1..1
    ok 1 - classic, no plan # time=1.3371337ms
    # classic, plan
        1..1
        ok 1 - passed
    ok 2 - classic, plan # time=1.3371337ms
    # classic, plan w/comment
        1..1 # comment
        ok 1 - passed
    ok 3 - classic, plan w/comment # time=1.3371337ms
    1..3
ok 1 - test/fixtures/classic-pass.js # time=1.3371337ms

# test/fixtures/inverted-pass.js
    # inverted
        ok 1 - passed
        1..1
    ok 1 - inverted # time=1.3371337ms
    1..1
ok 2 - test/fixtures/inverted-pass.js # time=1.3371337ms

1..2
# time=1.3371337ms

[?25h
`

exports['single failing test 1'] = `
[?25lTAP version 13
# test/fixtures/classic-fail.js
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
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
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
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
          ...

    not ok 2 - classic, with plan # time=1.3371337ms
    1..2
not ok 1 - test/fixtures/classic-fail.js # time=1.3371337ms

1..1
# time=1.3371337ms
# failing=2

[?25h
`

exports['multiple failing tests 1'] = `
[?25lTAP version 13
# test/fixtures/classic-fail.js
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
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
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
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
          ...

    not ok 2 - classic, with plan # time=1.3371337ms
    1..2
not ok 1 - test/fixtures/classic-fail.js # time=1.3371337ms

# test/fixtures/inverted-fail.js
    # inverted
        not ok 1 - failed
          ---
          operator: fail
          at:
            line: 4
            column: 8
            file: file:///inverted-fail.js
          source: |
            const assert = test('inverted') 
            assert.fail()
            -------^
            await assert.end()
          stack: |-
            test/fixtures/inverted-fail.js:13:37
          ...

        1..1
    not ok 1 - inverted # time=1.3371337ms
    1..1
not ok 2 - test/fixtures/inverted-fail.js # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=3

[?25h
`

exports['passing and failing tests 1'] = `
[?25lTAP version 13
# test/fixtures/classic-fail.js
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
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
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
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
          ...

    not ok 2 - classic, with plan # time=1.3371337ms
    1..2
not ok 1 - test/fixtures/classic-fail.js # time=1.3371337ms

# test/fixtures/inverted-pass.js
    # inverted
        ok 1 - passed
        1..1
    ok 1 - inverted # time=1.3371337ms
    1..1
ok 2 - test/fixtures/inverted-pass.js # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=2

[?25h
`

exports['--bail 1'] = `
[?25lTAP version 13
# test/fixtures/should-bail.js
    # success
        ok 1 - passed
        1..1
    ok 1 - success # time=1.3371337ms
    # fail
        not ok 1 - failed
          ---
          operator: fail
          at:
            line: 5
            column: 34
            file: file:///should-bail.js
          source: |-
            ---------------------------------^
          stack: |-
            test/fixtures/should-bail.js:13:37
            test/fixtures/should-bail.js:13:37
          ...

        Bail out! Failed test - fail
[?25h
`

exports['--reporter tap 1'] = `
[?25lTAP version 13
# test/fixtures/classic-fail.js
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
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
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
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
          ...

    not ok 2 - classic, with plan # time=1.3371337ms
    1..2
not ok 1 - test/fixtures/classic-fail.js # time=1.3371337ms

# test/fixtures/inverted-pass.js
    # inverted
        ok 1 - passed
        1..1
    ok 1 - inverted # time=1.3371337ms
    1..1
ok 2 - test/fixtures/inverted-pass.js # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=2

[?25h
`

exports['--reporter dot 1'] = `
[?25l

  ․․․

  2 failing

  1) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37

  2) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37


[?25h
`

exports['--reporter spec 1'] = `
[?25l
\r  1) failed
\r  2) failed
\r  ✓ passed

  2 failing

  1) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37

  2) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37


[?25h
`

exports['--bail 2'] = `
[?25lTAP version 13
# test/fixtures/should-bail.js
    # success
        ok 1 - passed
        1..1
    ok 1 - success # time=1.3371337ms
    # fail
        not ok 1 - failed
          ---
          operator: fail
          at:
            line: 5
            column: 34
            file: file:///should-bail.js
          source: |-
            ---------------------------------^
          stack: |-
            test/fixtures/should-bail.js:13:37
            test/fixtures/should-bail.js:13:37
          ...

        Bail out! Failed test - fail
[?25h
`

exports['--reporter tap 2'] = `
[?25lTAP version 13
# test/fixtures/classic-fail.js
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
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
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
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
          ...

    not ok 2 - classic, with plan # time=1.3371337ms
    1..2
not ok 1 - test/fixtures/classic-fail.js # time=1.3371337ms

# test/fixtures/inverted-pass.js
    # inverted
        ok 1 - passed
        1..1
    ok 1 - inverted # time=1.3371337ms
    1..1
ok 2 - test/fixtures/inverted-pass.js # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=2

[?25h
`

exports['--reporter dot 2'] = `
[?25l

  ․․․

  2 failing

  1) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37

  2) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37


[?25h
`

exports['--reporter spec 2'] = `
[?25l
\r  1) failed
\r  2) failed
\r  ✓ passed

  2 failing

  1) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37

  2) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37


[?25h
`

exports['--reporter tap 3'] = `
[?25lTAP version 13
# test/fixtures/classic-fail.js
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
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
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
              fail()
            --^
            })
          stack: |-
            test/fixtures/classic-fail.js:13:37
            test/fixtures/classic-fail.js:13:37
          ...

    not ok 2 - classic, with plan # time=1.3371337ms
    1..2
not ok 1 - test/fixtures/classic-fail.js # time=1.3371337ms

# test/fixtures/inverted-pass.js
    # inverted
        ok 1 - passed
        1..1
    ok 1 - inverted # time=1.3371337ms
    1..1
ok 2 - test/fixtures/inverted-pass.js # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=2

[?25h
`

exports['--reporter dot 3'] = `
[?25l

  ․․․

  2 failing

  1) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37

  2) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37


[?25h
`

exports['--reporter spec 3'] = `
[?25l
\r  1) failed
\r  2) failed
\r  ✓ passed

  2 failing

  1) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37

  2) failed:
     Error: failed
      at test/fixtures/classic-fail.js:13:37
      at test/fixtures/classic-fail.js:13:37


[?25h
`

exports['enter watch mode, ctrl + c exit 1'] = `
[?2004l\r\r
[?25l[sTAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r
zsh: warning: 1 jobs SIGHUPed\r

`

exports['enter watch mode, x to exit 1'] = `
[?2004l\r\r
[?25l[sTAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r
\r
Exiting...\r

`

exports['watch mode, force reload 1'] = `
[?2004l\r\r
[?25l[sTAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r
c[u[S[STAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r

`

exports['watch mode, reload from file change 1'] = `
[?2004l\r\r
[?25l[sTAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r
[2m\r
change detected fixtures/classic-pass.js (change)[22m\r
c[u[S[STAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r

`

exports['watch mode, select dot reporter 1'] = `
[?2004l\r\r
[?25l[sTAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r
\r
📋 Select a reporter\r
\r
   🥜 [1mtap[22m\r
      dot\r
      spec\r
[3A      [1mtap[22m\r
   🥜 dot\r
      spec\r
[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[G\r
📋 Selected reporter: [1mdot[22m\r
\r
c[u[S[S\r
\r
  [90m․[0m[90m․[0m[90m․[0m[90m․[0m\r
\r
[92m [0m[32m 4 passing[0m[90m 13.37ms[0m\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r

`

exports['watch mode, select spec reporter 1'] = `
[?2004l\r\r
[?25l[sTAP version 13\r
# fixtures/classic-pass.js\r
    # classic, no plan\r
        ok 1 - passed\r
        1..1\r
    ok 1 - classic, no plan # time=1.3371337ms\r
    # classic, plan\r
        1..1\r
        ok 1 - passed\r
    ok 2 - classic, plan # time=1.3371337ms\r
    # classic, plan w/comment\r
        1..1 # comment\r
        ok 1 - passed\r
    ok 3 - classic, plan w/comment # time=1.3371337ms\r
    1..3\r
ok 1 - fixtures/classic-pass.js # time=1.3371337ms\r
\r
# fixtures/inverted-pass.js\r
    # inverted\r
        ok 1 - passed\r
        1..1\r
    ok 1 - inverted # time=1.3371337ms\r
    1..1\r
ok 2 - fixtures/inverted-pass.js # time=1.3371337ms\r
\r
1..2\r
# time=1.3371337ms\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r
\r
📋 Select a reporter\r
\r
   🥜 [1mtap[22m\r
      dot\r
      spec\r
[3A      [1mtap[22m\r
   🥜 dot\r
      spec\r
[3A      [1mtap[22m\r
      dot\r
   🥜 spec\r
[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[G\r
📋 Selected reporter: [1mspec[22m\r
\r
c[u[S[S\r
[2K[0G[32m  ✓[0m[90m passed[0m\r
[2K[0G[32m  ✓[0m[90m passed[0m\r
[2K[0G[32m  ✓[0m[90m passed[0m\r
[2K[0G[32m  ✓[0m[90m passed[0m\r
\r
[92m [0m[32m 4 passing[0m[90m 13.37ms[0m\r
\r
🥜 Watch mode on\r
   Press [1mw[22m to force reload\r
   Press [1mr[22m to change reporter\r
   Press [1mx[22m to exit\r

`
