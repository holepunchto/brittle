TAP version 13
# classic assertions
    ok 1 - should be equal
    ok 2 - valid tap output
    not ok 3 - should match snapshot
      ---
      actual: |
        TAP version 13
        # passing (default messages)
            ok 1 - passed
            ok 2 - expected truthy value
            ok 3 - expected falsey value
            ok 4 - should be equal
            ok 5 - should be equal
            ok 6 - should not be equal
            ok 7 - should not be equal
            ok 8 - should deep equal
            ok 9 - should deep equal
            ok 10 - should not deep equal
            ok 11 - should not deep equal
            ok 12 - should resolve
            ok 13 - should resolve
            ok 14 - should return
            ok 15 - should reject
            ok 16 - should reject
            ok 17 - should throw
            1..17
        ok 1 - passing (default messages) # time=1.3371337ms
        # passing (custom messages)
            ok 1 - peanut
            ok 2 - brittle
            ok 3 - is
            ok 4 - an
            ok 5 - often
            ok 6 - overlooked
            ok 7 - tasty
            ok 8 - treat
            ok 9 - you should
            ok 10 - try it
            ok 11 - sometime
            ok 12 - but
            ok 13 - not really
            ok 14 - personally
            ok 15 - I have not had it
            ok 16 - in a long
            ok 17 - long time
            1..17
        ok 2 - passing (custom messages) # time=1.3371337ms
        # failing (default messages)
            not ok 1 - failed
              ---
              operator: fail
              at:
                line: 44
                column: 10
                file: file:///classic-assertions.js
              source: |-
                test('failing (default messages)', async (assert) => {
                  assert.fail()
                ---------^
                  assert.ok(false)
                  assert.absent(true)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 2 - expected truthy value
              ---
              actual: false
              expected: true
              operator: ok
              at:
                line: 45
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.fail()
                  assert.ok(false)
                ---------^
                  assert.absent(true)
                  assert.is(1, 2)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 3 - expected falsey value
              ---
              actual: true
              expected: false
              operator: absent
              at:
                line: 46
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.ok(false)
                  assert.absent(true)
                ---------^
                  assert.is(1, 2)
                  assert.is.coercively('2', 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 4 - should be equal
              ---
              actual: 1
              expected: 2
              operator: is
              at:
                line: 47
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.absent(true)
                  assert.is(1, 2)
                ---------^
                  assert.is.coercively('2', 1)
                  assert.not(1, 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 5 - should be equal
              ---
              actual: "2"
              expected: 1
              operator: is
              at:
                line: 48
                column: 13
                file: file:///classic-assertions.js
              source: |-2
                  assert.is(1, 2)
                  assert.is.coercively('2', 1)
                ------------^
                  assert.not(1, 1)
                  assert.not.coercively(1, '1')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 6 - should not be equal
              ---
              actual: 1
              expected: 1
              operator: not
              at:
                line: 49
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.is.coercively('2', 1)
                  assert.not(1, 1)
                ---------^
                  assert.not.coercively(1, '1')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 7 - should not be equal
              ---
              actual: 1
              expected: "1"
              operator: not
              at:
                line: 50
                column: 14
                file: file:///classic-assertions.js
              source: |-2
                  assert.not(1, 1)
                  assert.not.coercively(1, '1')
                -------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 8 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: 2
              operator: alike
              at:
                line: 51
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.not.coercively(1, '1')
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 9 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: "2"
              operator: alike
              at:
                line: 52
                column: 16
                file: file:///classic-assertions.js
              source: |-2
                ---------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 10 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: 2
              operator: unlike
              at:
                line: 53
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                ---------^
                  assert.execution(Promise.reject(Error('n')))
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 11 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: "2"
              operator: unlike
              at:
                line: 54
                column: 17
                file: file:///classic-assertions.js
              source: |-2
                ----------------^
                  assert.execution(Promise.reject(Error('n')))
                  assert.execution(async () => { throw Error('n') })
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 12 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
              expected: null
              operator: execution
              at:
                line: 55
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')))
                ---------^
                  assert.execution(async () => { throw Error('n') })
                  assert.execution(() => { throw Error('n') })
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            not ok 13 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
              expected: null
              operator: execution
              at:
                line: 56
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')))
                  assert.execution(async () => { throw Error('n') })
                ---------^
                  assert.execution(() => { throw Error('n') })
                  assert.exception(Promise.resolve('y'))
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            not ok 14 - should return
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
              expected: null
              operator: execution
              at:
                line: 57
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(async () => { throw Error('n') })
                  assert.execution(() => { throw Error('n') })
                ---------^
                  assert.exception(Promise.resolve('y'))
                  assert.exception(Promise.reject('n'), /y/)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 15 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 58
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => { throw Error('n') })
                  assert.exception(Promise.resolve('y'))
                ---------^
                  assert.exception(Promise.reject('n'), /y/)
                  assert.exception(async () => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            not ok 16 - should reject
              ---
              actual: false
              expected: !re /y/
              operator: exception
              at:
                line: 59
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.resolve('y'))
                  assert.exception(Promise.reject('n'), /y/)
                ---------^
                  assert.exception(async () => 'y')
                  assert.exception(() => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            not ok 17 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 60
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.reject('n'), /y/)
                  assert.exception(async () => 'y')
                ---------^
                  assert.exception(() => 'y')
                })
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            not ok 18 - should throw
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 61
                column: 10
                file: file:///classic-assertions.js
              source: |2
                  assert.exception(async () => 'y')
                  assert.exception(() => 'y')
                ---------^
                })
              stack: "AssertionError [ERR_ASSERTION]: should throw::"
              ...
            1..18
        not ok 3 - failing (default messages) # time=1.3371337ms
        # failing (custom messages)
            not ok 1 - peanut
              ---
              operator: fail
              at:
                line: 65
                column: 10
                file: file:///classic-assertions.js
              source: |-
                test('failing (custom messages)', async (assert) => {
                  assert.fail('peanut')
                ---------^
                  assert.ok(false, 'brittle')
                  assert.absent(true, 'is')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 2 - brittle
              ---
              actual: false
              expected: true
              operator: ok
              at:
                line: 66
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.fail('peanut')
                  assert.ok(false, 'brittle')
                ---------^
                  assert.absent(true, 'is')
                  assert.is(1, 2, 'an')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 3 - is
              ---
              actual: true
              expected: false
              operator: absent
              at:
                line: 67
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.ok(false, 'brittle')
                  assert.absent(true, 'is')
                ---------^
                  assert.is(1, 2, 'an')
                  assert.is.coercively('2', 1, 'often')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 4 - an
              ---
              actual: 1
              expected: 2
              operator: is
              at:
                line: 68
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.absent(true, 'is')
                  assert.is(1, 2, 'an')
                ---------^
                  assert.is.coercively('2', 1, 'often')
                  assert.not(1, 1, 'overlooked')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 5 - often
              ---
              actual: "2"
              expected: 1
              operator: is
              at:
                line: 69
                column: 13
                file: file:///classic-assertions.js
              source: |-2
                  assert.is(1, 2, 'an')
                  assert.is.coercively('2', 1, 'often')
                ------------^
                  assert.not(1, 1, 'overlooked')
                  assert.not.coercively(1, '1', 'tasty')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 6 - overlooked
              ---
              actual: 1
              expected: 1
              operator: not
              at:
                line: 70
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.is.coercively('2', 1, 'often')
                  assert.not(1, 1, 'overlooked')
                ---------^
                  assert.not.coercively(1, '1', 'tasty')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 7 - tasty
              ---
              actual: 1
              expected: "1"
              operator: not
              at:
                line: 71
                column: 14
                file: file:///classic-assertions.js
              source: |-2
                  assert.not(1, 1, 'overlooked')
                  assert.not.coercively(1, '1', 'tasty')
                -------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 8 - treat
              ---
              actual:
                a: 1
              expected:
                a: 2
              operator: alike
              at:
                line: 72
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.not.coercively(1, '1', 'tasty')
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 9 - you should
              ---
              actual:
                a: 1
              expected:
                a: "2"
              operator: alike
              at:
                line: 73
                column: 16
                file: file:///classic-assertions.js
              source: |-2
                ---------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 10 - try it
              ---
              actual:
                a: 2
              expected:
                a: 2
              operator: unlike
              at:
                line: 74
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                ---------^
                  assert.execution(Promise.reject(Error('n')), 'but')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 11 - sometime
              ---
              actual:
                a: 2
              expected:
                a: "2"
              operator: unlike
              at:
                line: 75
                column: 17
                file: file:///classic-assertions.js
              source: |-2
                ----------------^
                  assert.execution(Promise.reject(Error('n')), 'but')
                  assert.execution(async () => { throw Error('n') }, 'not really')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 12 - but
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
              expected: null
              operator: execution
              at:
                line: 76
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')), 'but')
                ---------^
                  assert.execution(async () => { throw Error('n') }, 'not really')
                  assert.execution(() => { throw Error('n') }, 'personally')
              stack: "AssertionError [ERR_ASSERTION]: but::"
              ...
            not ok 13 - not really
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
              expected: null
              operator: execution
              at:
                line: 77
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')), 'but')
                  assert.execution(async () => { throw Error('n') }, 'not really')
                ---------^
                  assert.execution(() => { throw Error('n') }, 'personally')
                  assert.exception(Promise.resolve('y'), 'I have not had it')
              stack: "AssertionError [ERR_ASSERTION]: not really::"
              ...
            not ok 14 - personally
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
              expected: null
              operator: execution
              at:
                line: 78
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(async () => { throw Error('n') }, 'not really')
                  assert.execution(() => { throw Error('n') }, 'personally')
                ---------^
                  assert.exception(Promise.resolve('y'), 'I have not had it')
                  assert.exception(async () => 'y', 'in a long')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 15 - I have not had it
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 79
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => { throw Error('n') }, 'personally')
                  assert.exception(Promise.resolve('y'), 'I have not had it')
                ---------^
                  assert.exception(async () => 'y', 'in a long')
                  assert.exception(() => 'y', 'long time')
              stack: "AssertionError [ERR_ASSERTION]: I have not had it::"
              ...
            not ok 16 - in a long
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 80
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.resolve('y'), 'I have not had it')
                  assert.exception(async () => 'y', 'in a long')
                ---------^
                  assert.exception(() => 'y', 'long time')
                })
              stack: "AssertionError [ERR_ASSERTION]: in a long::"
              ...
            not ok 17 - long time
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 81
                column: 10
                file: file:///classic-assertions.js
              source: |2
                  assert.exception(async () => 'y', 'in a long')
                  assert.exception(() => 'y', 'long time')
                ---------^
                })
              stack: "AssertionError [ERR_ASSERTION]: long time::"
              ...
            1..17
        not ok 4 - failing (custom messages) # time=1.3371337ms
        # passing and failing mixed
            not ok 1 - failed
              ---
              operator: fail
              at:
                line: 85
                column: 10
                file: file:///classic-assertions.js
              source: |-
                test('passing and failing mixed', async (assert) => {
                  assert.fail()
                ---------^
                  assert.pass()
                  assert.ok(false)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 2 - passed
            not ok 3 - expected truthy value
              ---
              actual: false
              expected: true
              operator: ok
              at:
                line: 87
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.pass()
                  assert.ok(false)
                ---------^
                  assert.ok(true)
                  assert.absent(true)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 4 - expected truthy value
            not ok 5 - expected falsey value
              ---
              actual: true
              expected: false
              operator: absent
              at:
                line: 89
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.ok(true)
                  assert.absent(true)
                ---------^
                  assert.absent(false)
                  assert.is(1, 2)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 6 - expected falsey value
            not ok 7 - should be equal
              ---
              actual: 1
              expected: 2
              operator: is
              at:
                line: 91
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.absent(false)
                  assert.is(1, 2)
                ---------^
                  assert.is(1, 1)
                  assert.is.coercively('2', 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 8 - should be equal
            not ok 9 - should be equal
              ---
              actual: "2"
              expected: 1
              operator: is
              at:
                line: 93
                column: 13
                file: file:///classic-assertions.js
              source: |-2
                  assert.is(1, 1)
                  assert.is.coercively('2', 1)
                ------------^
                  assert.is.coercively('1', 1)
                  assert.not(1, 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 10 - should be equal
            not ok 11 - should not be equal
              ---
              actual: 1
              expected: 1
              operator: not
              at:
                line: 95
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.is.coercively('1', 1)
                  assert.not(1, 1)
                ---------^
                  assert.not(1, 2)
                  assert.not.coercively(1, '1')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 12 - should not be equal
            not ok 13 - should not be equal
              ---
              actual: 1
              expected: "1"
              operator: not
              at:
                line: 97
                column: 14
                file: file:///classic-assertions.js
              source: |-2
                  assert.not(1, 2)
                  assert.not.coercively(1, '1')
                -------------^
                  assert.not.coercively(1, '2')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 14 - should not be equal
            not ok 15 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: 2
              operator: alike
              at:
                line: 99
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.not.coercively(1, '2')
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 16 - should deep equal
            not ok 17 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: "2"
              operator: alike
              at:
                line: 101
                column: 16
                file: file:///classic-assertions.js
              source: |-2
                ---------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 18 - should deep equal
            not ok 19 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: 2
              operator: unlike
              at:
                line: 103
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 20 - should not deep equal
            not ok 21 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: "2"
              operator: unlike
              at:
                line: 105
                column: 17
                file: file:///classic-assertions.js
              source: |-2
                ----------------^
                  assert.execution(Promise.resolve('y'))
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 22 - should not deep equal
            ok 23 - should resolve
            not ok 24 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
              expected: null
              operator: execution
              at:
                line: 108
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.resolve('y'))
                  assert.execution(Promise.reject(Error('n')))
                ---------^
                  assert.execution(async () => 'y')
                  assert.execution(async () => { throw Error('n') })
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            not ok 28 - should return
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
              expected: null
              operator: execution
              at:
                line: 112
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => 'y')
                  assert.execution(() => { throw Error('n') })
                ---------^
                  assert.exception(Promise.resolve('y'))
                  assert.exception(Promise.reject(Error('n')))
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 25 - should resolve
            not ok 26 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
              expected: null
              operator: execution
              at:
                line: 110
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(async () => 'y')
                  assert.execution(async () => { throw Error('n') })
                ---------^
                  assert.execution(() => 'y')
                  assert.execution(() => { throw Error('n') })
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            ok 27 - should return
            not ok 29 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 113
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => { throw Error('n') })
                  assert.exception(Promise.resolve('y'))
                ---------^
                  assert.exception(Promise.reject(Error('n')))
                  assert.exception(async () => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            ok 30 - should reject
            not ok 31 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 115
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.reject(Error('n')))
                  assert.exception(async () => 'y')
                ---------^
                  assert.exception(async () => { throw Error('n') })
                  assert.exception(() => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            ok 32 - should reject
            not ok 33 - should throw
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 117
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(async () => { throw Error('n') })
                  assert.exception(() => 'y')
                ---------^
                  assert.exception(() => { throw Error('n') })
                })
              stack: "AssertionError [ERR_ASSERTION]: should throw::"
              ...
            ok 34 - should throw
            1..34
        not ok 5 - passing and failing mixed # time=1.3371337ms
        1..5
        # time=1.3371337ms
        # failing=52
      expected: |
        TAP version 13
        # passing (default messages)
            ok 1 - passed
            ok 2 - expected truthy value
            ok 3 - expected falsey value
            ok 4 - should be equal
            ok 5 - should be equal
            ok 6 - should not be equal
            ok 7 - should not be equal
            ok 8 - should deep equal
            ok 9 - should deep equal
            ok 10 - should not deep equal
            ok 11 - should not deep equal
            ok 12 - should resolve
            ok 13 - should resolve
            ok 14 - should return
            ok 15 - should reject
            ok 16 - should reject
            ok 17 - should throw
            1..17
        ok 1 - passing (default messages) # time=1.3371337ms
        # passing (custom messages)
            ok 1 - peanut
            ok 2 - brittle
            ok 3 - is
            ok 4 - an
            ok 5 - often
            ok 6 - overlooked
            ok 7 - tasty
            ok 8 - treat
            ok 9 - you should
            ok 10 - try it
            ok 11 - sometime
            ok 12 - but
            ok 13 - not really
            ok 14 - personally
            ok 15 - I have not had it
            ok 16 - in a long
            ok 17 - long time
            1..17
        ok 2 - passing (custom messages) # time=1.3371337ms
        # failing (default messages)
            not ok 1 - failed
              ---
              operator: fail
              at:
                line: 44
                column: 10
                file: file:///classic-assertions.js
              source: |-
                test('failing (default messages)', async (assert) => {
                  assert.fail()
                ---------^
                  assert.ok(false)
                  assert.absent(true)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 2 - expected truthy value
              ---
              actual: false
              expected: true
              operator: ok
              at:
                line: 45
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.fail()
                  assert.ok(false)
                ---------^
                  assert.absent(true)
                  assert.is(1, 2)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 3 - expected falsey value
              ---
              actual: true
              expected: false
              operator: absent
              at:
                line: 46
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.ok(false)
                  assert.absent(true)
                ---------^
                  assert.is(1, 2)
                  assert.is.coercively('2', 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 4 - should be equal
              ---
              actual: 1
              expected: 2
              operator: is
              at:
                line: 47
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.absent(true)
                  assert.is(1, 2)
                ---------^
                  assert.is.coercively('2', 1)
                  assert.not(1, 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 5 - should be equal
              ---
              actual: "2"
              expected: 1
              operator: is
              at:
                line: 48
                column: 13
                file: file:///classic-assertions.js
              source: |-2
                  assert.is(1, 2)
                  assert.is.coercively('2', 1)
                ------------^
                  assert.not(1, 1)
                  assert.not.coercively(1, '1')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 6 - should not be equal
              ---
              actual: 1
              expected: 1
              operator: not
              at:
                line: 49
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.is.coercively('2', 1)
                  assert.not(1, 1)
                ---------^
                  assert.not.coercively(1, '1')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 7 - should not be equal
              ---
              actual: 1
              expected: "1"
              operator: not
              at:
                line: 50
                column: 14
                file: file:///classic-assertions.js
              source: |-2
                  assert.not(1, 1)
                  assert.not.coercively(1, '1')
                -------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 8 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: 2
              operator: alike
              at:
                line: 51
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.not.coercively(1, '1')
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 9 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: "2"
              operator: alike
              at:
                line: 52
                column: 16
                file: file:///classic-assertions.js
              source: |-2
                ---------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 10 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: 2
              operator: unlike
              at:
                line: 53
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                ---------^
                  assert.execution(Promise.reject(Error('n')))
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 11 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: "2"
              operator: unlike
              at:
                line: 54
                column: 17
                file: file:///classic-assertions.js
              source: |-2
                ----------------^
                  assert.execution(Promise.reject(Error('n')))
                  assert.execution(async () => { throw Error('n') })
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 12 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
              expected: null
              operator: execution
              at:
                line: 55
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')))
                ---------^
                  assert.execution(async () => { throw Error('n') })
                  assert.execution(() => { throw Error('n') })
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            not ok 13 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
              expected: null
              operator: execution
              at:
                line: 56
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')))
                  assert.execution(async () => { throw Error('n') })
                ---------^
                  assert.execution(() => { throw Error('n') })
                  assert.exception(Promise.resolve('y'))
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            not ok 14 - should return
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
              expected: null
              operator: execution
              at:
                line: 57
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(async () => { throw Error('n') })
                  assert.execution(() => { throw Error('n') })
                ---------^
                  assert.exception(Promise.resolve('y'))
                  assert.exception(Promise.reject('n'), /y/)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 15 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 58
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => { throw Error('n') })
                  assert.exception(Promise.resolve('y'))
                ---------^
                  assert.exception(Promise.reject('n'), /y/)
                  assert.exception(async () => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            not ok 16 - should reject
              ---
              actual: false
              expected: !re /y/
              operator: exception
              at:
                line: 59
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.resolve('y'))
                  assert.exception(Promise.reject('n'), /y/)
                ---------^
                  assert.exception(async () => 'y')
                  assert.exception(() => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            not ok 17 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 60
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.reject('n'), /y/)
                  assert.exception(async () => 'y')
                ---------^
                  assert.exception(() => 'y')
                })
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            not ok 18 - should throw
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 61
                column: 10
                file: file:///classic-assertions.js
              source: |2
                  assert.exception(async () => 'y')
                  assert.exception(() => 'y')
                ---------^
                })
              stack: "AssertionError [ERR_ASSERTION]: should throw::"
              ...
            1..18
        not ok 3 - failing (default messages) # time=1.3371337ms
        # failing (custom messages)
            not ok 1 - peanut
              ---
              operator: fail
              at:
                line: 65
                column: 10
                file: file:///classic-assertions.js
              source: |-
                test('failing (custom messages)', async (assert) => {
                  assert.fail('peanut')
                ---------^
                  assert.ok(false, 'brittle')
                  assert.absent(true, 'is')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 2 - brittle
              ---
              actual: false
              expected: true
              operator: ok
              at:
                line: 66
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.fail('peanut')
                  assert.ok(false, 'brittle')
                ---------^
                  assert.absent(true, 'is')
                  assert.is(1, 2, 'an')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 3 - is
              ---
              actual: true
              expected: false
              operator: absent
              at:
                line: 67
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.ok(false, 'brittle')
                  assert.absent(true, 'is')
                ---------^
                  assert.is(1, 2, 'an')
                  assert.is.coercively('2', 1, 'often')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 4 - an
              ---
              actual: 1
              expected: 2
              operator: is
              at:
                line: 68
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.absent(true, 'is')
                  assert.is(1, 2, 'an')
                ---------^
                  assert.is.coercively('2', 1, 'often')
                  assert.not(1, 1, 'overlooked')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 5 - often
              ---
              actual: "2"
              expected: 1
              operator: is
              at:
                line: 69
                column: 13
                file: file:///classic-assertions.js
              source: |-2
                  assert.is(1, 2, 'an')
                  assert.is.coercively('2', 1, 'often')
                ------------^
                  assert.not(1, 1, 'overlooked')
                  assert.not.coercively(1, '1', 'tasty')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 6 - overlooked
              ---
              actual: 1
              expected: 1
              operator: not
              at:
                line: 70
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.is.coercively('2', 1, 'often')
                  assert.not(1, 1, 'overlooked')
                ---------^
                  assert.not.coercively(1, '1', 'tasty')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 7 - tasty
              ---
              actual: 1
              expected: "1"
              operator: not
              at:
                line: 71
                column: 14
                file: file:///classic-assertions.js
              source: |-2
                  assert.not(1, 1, 'overlooked')
                  assert.not.coercively(1, '1', 'tasty')
                -------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 8 - treat
              ---
              actual:
                a: 1
              expected:
                a: 2
              operator: alike
              at:
                line: 72
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.not.coercively(1, '1', 'tasty')
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 9 - you should
              ---
              actual:
                a: 1
              expected:
                a: "2"
              operator: alike
              at:
                line: 73
                column: 16
                file: file:///classic-assertions.js
              source: |-2
                ---------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 10 - try it
              ---
              actual:
                a: 2
              expected:
                a: 2
              operator: unlike
              at:
                line: 74
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                ---------^
                  assert.execution(Promise.reject(Error('n')), 'but')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 11 - sometime
              ---
              actual:
                a: 2
              expected:
                a: "2"
              operator: unlike
              at:
                line: 75
                column: 17
                file: file:///classic-assertions.js
              source: |-2
                ----------------^
                  assert.execution(Promise.reject(Error('n')), 'but')
                  assert.execution(async () => { throw Error('n') }, 'not really')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 12 - but
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
              expected: null
              operator: execution
              at:
                line: 76
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')), 'but')
                ---------^
                  assert.execution(async () => { throw Error('n') }, 'not really')
                  assert.execution(() => { throw Error('n') }, 'personally')
              stack: "AssertionError [ERR_ASSERTION]: but::"
              ...
            not ok 13 - not really
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
              expected: null
              operator: execution
              at:
                line: 77
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.reject(Error('n')), 'but')
                  assert.execution(async () => { throw Error('n') }, 'not really')
                ---------^
                  assert.execution(() => { throw Error('n') }, 'personally')
                  assert.exception(Promise.resolve('y'), 'I have not had it')
              stack: "AssertionError [ERR_ASSERTION]: not really::"
              ...
            not ok 14 - personally
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
              expected: null
              operator: execution
              at:
                line: 78
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(async () => { throw Error('n') }, 'not really')
                  assert.execution(() => { throw Error('n') }, 'personally')
                ---------^
                  assert.exception(Promise.resolve('y'), 'I have not had it')
                  assert.exception(async () => 'y', 'in a long')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            not ok 15 - I have not had it
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 79
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => { throw Error('n') }, 'personally')
                  assert.exception(Promise.resolve('y'), 'I have not had it')
                ---------^
                  assert.exception(async () => 'y', 'in a long')
                  assert.exception(() => 'y', 'long time')
              stack: "AssertionError [ERR_ASSERTION]: I have not had it::"
              ...
            not ok 16 - in a long
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 80
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.resolve('y'), 'I have not had it')
                  assert.exception(async () => 'y', 'in a long')
                ---------^
                  assert.exception(() => 'y', 'long time')
                })
              stack: "AssertionError [ERR_ASSERTION]: in a long::"
              ...
            not ok 17 - long time
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 81
                column: 10
                file: file:///classic-assertions.js
              source: |2
                  assert.exception(async () => 'y', 'in a long')
                  assert.exception(() => 'y', 'long time')
                ---------^
                })
              stack: "AssertionError [ERR_ASSERTION]: long time::"
              ...
            1..17
        not ok 4 - failing (custom messages) # time=1.3371337ms
        # passing and failing mixed
            not ok 1 - failed
              ---
              operator: fail
              at:
                line: 85
                column: 10
                file: file:///classic-assertions.js
              source: |-
                test('passing and failing mixed', async (assert) => {
                  assert.fail()
                ---------^
                  assert.pass()
                  assert.ok(false)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 2 - passed
            not ok 3 - expected truthy value
              ---
              actual: false
              expected: true
              operator: ok
              at:
                line: 87
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.pass()
                  assert.ok(false)
                ---------^
                  assert.ok(true)
                  assert.absent(true)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 4 - expected truthy value
            not ok 5 - expected falsey value
              ---
              actual: true
              expected: false
              operator: absent
              at:
                line: 89
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.ok(true)
                  assert.absent(true)
                ---------^
                  assert.absent(false)
                  assert.is(1, 2)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 6 - expected falsey value
            not ok 7 - should be equal
              ---
              actual: 1
              expected: 2
              operator: is
              at:
                line: 91
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.absent(false)
                  assert.is(1, 2)
                ---------^
                  assert.is(1, 1)
                  assert.is.coercively('2', 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 8 - should be equal
            not ok 9 - should be equal
              ---
              actual: "2"
              expected: 1
              operator: is
              at:
                line: 93
                column: 13
                file: file:///classic-assertions.js
              source: |-2
                  assert.is(1, 1)
                  assert.is.coercively('2', 1)
                ------------^
                  assert.is.coercively('1', 1)
                  assert.not(1, 1)
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 10 - should be equal
            not ok 11 - should not be equal
              ---
              actual: 1
              expected: 1
              operator: not
              at:
                line: 95
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.is.coercively('1', 1)
                  assert.not(1, 1)
                ---------^
                  assert.not(1, 2)
                  assert.not.coercively(1, '1')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 12 - should not be equal
            not ok 13 - should not be equal
              ---
              actual: 1
              expected: "1"
              operator: not
              at:
                line: 97
                column: 14
                file: file:///classic-assertions.js
              source: |-2
                  assert.not(1, 2)
                  assert.not.coercively(1, '1')
                -------------^
                  assert.not.coercively(1, '2')
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 14 - should not be equal
            not ok 15 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: 2
              operator: alike
              at:
                line: 99
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.not.coercively(1, '2')
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 16 - should deep equal
            not ok 17 - should deep equal
              ---
              actual:
                a: 1
              expected:
                a: "2"
              operator: alike
              at:
                line: 101
                column: 16
                file: file:///classic-assertions.js
              source: |-2
                ---------------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 18 - should deep equal
            not ok 19 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: 2
              operator: unlike
              at:
                line: 103
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                ---------^
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 20 - should not deep equal
            not ok 21 - should not deep equal
              ---
              actual:
                a: 2
              expected:
                a: "2"
              operator: unlike
              at:
                line: 105
                column: 17
                file: file:///classic-assertions.js
              source: |-2
                ----------------^
                  assert.execution(Promise.resolve('y'))
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 22 - should not deep equal
            ok 23 - should resolve
            not ok 24 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
                      at file:///classic-assertions.js:13:37
              expected: null
              operator: execution
              at:
                line: 108
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(Promise.resolve('y'))
                  assert.execution(Promise.reject(Error('n')))
                ---------^
                  assert.execution(async () => 'y')
                  assert.execution(async () => { throw Error('n') })
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            not ok 28 - should return
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
              expected: null
              operator: execution
              at:
                line: 112
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => 'y')
                  assert.execution(() => { throw Error('n') })
                ---------^
                  assert.exception(Promise.resolve('y'))
                  assert.exception(Promise.reject(Error('n')))
              stack: |-
                test/fixtures/classic-assertions.js:13:37
                test/fixtures/classic-assertions.js:13:37
              ...
            ok 25 - should resolve
            not ok 26 - should resolve
              ---
              actual:
                !error
                name: Error
                message: n
                stack: >-
                  Error: n
                      at file:///classic-assertions.js:13:37
                      at file:///classic-assertions.js:13:37
                      at index.js:13:37
                      at index.js:13:37
                      at new Promise (<anonymous>)
              expected: null
              operator: execution
              at:
                line: 110
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(async () => 'y')
                  assert.execution(async () => { throw Error('n') })
                ---------^
                  assert.execution(() => 'y')
                  assert.execution(() => { throw Error('n') })
              stack: "AssertionError [ERR_ASSERTION]: should resolve::"
              ...
            ok 27 - should return
            not ok 29 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 113
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.execution(() => { throw Error('n') })
                  assert.exception(Promise.resolve('y'))
                ---------^
                  assert.exception(Promise.reject(Error('n')))
                  assert.exception(async () => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            ok 30 - should reject
            not ok 31 - should reject
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 115
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(Promise.reject(Error('n')))
                  assert.exception(async () => 'y')
                ---------^
                  assert.exception(async () => { throw Error('n') })
                  assert.exception(() => 'y')
              stack: "AssertionError [ERR_ASSERTION]: should reject::"
              ...
            ok 32 - should reject
            not ok 33 - should throw
              ---
              actual: false
              expected: null
              operator: exception
              at:
                line: 117
                column: 10
                file: file:///classic-assertions.js
              source: |-2
                  assert.exception(async () => { throw Error('n') })
                  assert.exception(() => 'y')
                ---------^
                  assert.exception(() => { throw Error('n') })
                })
              stack: "AssertionError [ERR_ASSERTION]: should throw::"
              ...
            ok 34 - should throw
            1..34
        not ok 5 - passing and failing mixed # time=1.3371337ms
        1..5
        # time=1.3371337ms
        # failing=52
      operator: snapshot
      at:
        line: 79
        column: 3
        file: file:///Users/davidclements/code/upend/brittle/test/index.test.js
      source: |2
          ok(valid(result), 'valid tap output')
          snapshot(result.stdout)
        --^
        })
      stack: test/index.test.js:79:3
      ...

    1..3
not ok 1 - classic assertions # time=475.59438ms

1..1
# time=489.747486ms
# failing=1
# Snapshot "classic assertions" is failing. To surgically update:
# SNAP="classic assertions" node test/index.test.js
