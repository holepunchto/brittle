exports['classic pass 1'] = `
TAP version 13
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
# time=1.3371337ms

`

exports['inverted fail 1'] = `
TAP version 13
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
# time=1.3371337ms
# failing=1

`

exports['classic fail 1'] = `
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
          plan(1)
          fail()
        --^
        })
      stack: test/fixtures/classic-fail.js:13:37
      ...

not ok 2 - classic, with plan # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=2

`

exports['inverted pass 1'] = `
TAP version 13
# inverted
    ok 1 - passed
    1..1
ok 1 - inverted # time=1.3371337ms

1..1
# time=1.3371337ms

`

exports['inverted assertions 1'] = `
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
        line: 49
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          const assert = test('failing (default messages)')
          assert.fail()
        ---------^
          assert.ok(false)
          assert.absent(true)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 2 - expected truthy value
      ---
      actual: false
      expected: true
      operator: ok
      at:
        line: 50
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.fail()
          assert.ok(false)
        ---------^
          assert.absent(true)
          assert.is(1, 2)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 3 - expected falsey value
      ---
      actual: true
      expected: false
      operator: absent
      at:
        line: 51
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.ok(false)
          assert.absent(true)
        ---------^
          assert.is(1, 2)
          assert.is.coercively('2', 1)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 4 - should be equal
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 52
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.absent(true)
          assert.is(1, 2)
        ---------^
          assert.is.coercively('2', 1)
          assert.not(1, 1)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 5 - should be equal
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 53
        column: 13
        file: file:///inverted-assertions.js
      source: |-2
          assert.is(1, 2)
          assert.is.coercively('2', 1)
        ------------^
          assert.not(1, 1)
          assert.not.coercively(1, '1')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 6 - should not be equal
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 54
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.is.coercively('2', 1)
          assert.not(1, 1)
        ---------^
          assert.not.coercively(1, '1')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 7 - should not be equal
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 55
        column: 14
        file: file:///inverted-assertions.js
      source: |-2
          assert.not(1, 1)
          assert.not.coercively(1, '1')
        -------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 8 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 56
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.not.coercively(1, '1')
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 9 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 57
        column: 16
        file: file:///inverted-assertions.js
      source: |-2
        ---------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 10 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 58
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
          assert.execution(Promise.reject(Error('n')))
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 11 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 59
        column: 17
        file: file:///inverted-assertions.js
      source: |-2
        ----------------^
          assert.execution(Promise.reject(Error('n')))
          assert.execution(async () => { throw Error('n') })
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 12 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 60
        column: 10
        file: file:///inverted-assertions.js
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
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 61
        column: 10
        file: file:///inverted-assertions.js
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
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 62
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.execution(async () => { throw Error('n') })
          assert.execution(() => { throw Error('n') })
        ---------^
          assert.exception(Promise.resolve('y'))
          assert.exception(Promise.reject('n'), /y/)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 15 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 63
        column: 10
        file: file:///inverted-assertions.js
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
        line: 64
        column: 10
        file: file:///inverted-assertions.js
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
        line: 65
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.exception(Promise.reject('n'), /y/)
          assert.exception(async () => 'y')
        ---------^
          assert.exception(() => 'y')
          await assert.end()
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 18 - should throw
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 66
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.exception(async () => 'y')
          assert.exception(() => 'y')
        ---------^
          await assert.end()
        }
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    1..18
not ok 3 - failing (default messages) # time=1.3371337ms

# failing (custom messages)
    not ok 1 - peanut
      ---
      operator: fail
      at:
        line: 72
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          const assert = test('failing (custom messages)')
          assert.fail('peanut')
        ---------^
          assert.ok(false, 'brittle')
          assert.absent(true, 'is')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 2 - brittle
      ---
      actual: false
      expected: true
      operator: ok
      at:
        line: 73
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.fail('peanut')
          assert.ok(false, 'brittle')
        ---------^
          assert.absent(true, 'is')
          assert.is(1, 2, 'an')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 3 - is
      ---
      actual: true
      expected: false
      operator: absent
      at:
        line: 74
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.ok(false, 'brittle')
          assert.absent(true, 'is')
        ---------^
          assert.is(1, 2, 'an')
          assert.is.coercively('2', 1, 'often')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 4 - an
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 75
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.absent(true, 'is')
          assert.is(1, 2, 'an')
        ---------^
          assert.is.coercively('2', 1, 'often')
          assert.not(1, 1, 'overlooked')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 5 - often
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 76
        column: 13
        file: file:///inverted-assertions.js
      source: |-2
          assert.is(1, 2, 'an')
          assert.is.coercively('2', 1, 'often')
        ------------^
          assert.not(1, 1, 'overlooked')
          assert.not.coercively(1, '1', 'tasty')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 6 - overlooked
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 77
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.is.coercively('2', 1, 'often')
          assert.not(1, 1, 'overlooked')
        ---------^
          assert.not.coercively(1, '1', 'tasty')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 7 - tasty
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 78
        column: 14
        file: file:///inverted-assertions.js
      source: |-2
          assert.not(1, 1, 'overlooked')
          assert.not.coercively(1, '1', 'tasty')
        -------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 8 - treat
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 79
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.not.coercively(1, '1', 'tasty')
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 9 - you should
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 80
        column: 16
        file: file:///inverted-assertions.js
      source: |-2
        ---------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 10 - try it
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 81
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
          assert.execution(Promise.reject(Error('n')), 'but')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 11 - sometime
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 82
        column: 17
        file: file:///inverted-assertions.js
      source: |-2
        ----------------^
          assert.execution(Promise.reject(Error('n')), 'but')
          assert.execution(async () => { throw Error('n') }, 'not really')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 12 - but
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 83
        column: 10
        file: file:///inverted-assertions.js
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
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 84
        column: 10
        file: file:///inverted-assertions.js
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
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 85
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.execution(async () => { throw Error('n') }, 'not really')
          assert.execution(() => { throw Error('n') }, 'personally')
        ---------^
          assert.exception(Promise.resolve('y'), 'I have not had it')
          assert.exception(async () => 'y', 'in a long')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 15 - I have not had it
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 86
        column: 10
        file: file:///inverted-assertions.js
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
        line: 87
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.exception(Promise.resolve('y'), 'I have not had it')
          assert.exception(async () => 'y', 'in a long')
        ---------^
          assert.exception(() => 'y', 'long time')
          await assert.end()
      stack: "AssertionError [ERR_ASSERTION]: in a long::"
      ...

    not ok 17 - long time
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 88
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.exception(async () => 'y', 'in a long')
          assert.exception(() => 'y', 'long time')
        ---------^
          await assert.end()
        }
      stack: "AssertionError [ERR_ASSERTION]: long time::"
      ...

    1..17
not ok 4 - failing (custom messages) # time=1.3371337ms

# passing and failing mixed
    not ok 1 - failed
      ---
      operator: fail
      at:
        line: 93
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        const assert = test('passing and failing mixed')
        assert.fail()
        -------^
        assert.pass()
        assert.ok(false)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 2 - passed
    not ok 3 - expected truthy value
      ---
      actual: false
      expected: true
      operator: ok
      at:
        line: 95
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.pass()
        assert.ok(false)
        -------^
        assert.ok(true)
        assert.absent(true)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 4 - expected truthy value
    not ok 5 - expected falsey value
      ---
      actual: true
      expected: false
      operator: absent
      at:
        line: 97
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.ok(true)
        assert.absent(true)
        -------^
        assert.absent(false)
        assert.is(1, 2)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 6 - expected falsey value
    not ok 7 - should be equal
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 99
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.absent(false)
        assert.is(1, 2)
        -------^
        assert.is(1, 1)
        assert.is.coercively('2', 1)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 8 - should be equal
    not ok 9 - should be equal
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 101
        column: 11
        file: file:///inverted-assertions.js
      source: |-
        assert.is(1, 1)
        assert.is.coercively('2', 1)
        ----------^
        assert.is.coercively('1', 1)
        assert.not(1, 1)
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 10 - should be equal
    not ok 11 - should not be equal
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 103
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.is.coercively('1', 1)
        assert.not(1, 1)
        -------^
        assert.not(1, 2)
        assert.not.coercively(1, '1')
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 12 - should not be equal
    not ok 13 - should not be equal
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 105
        column: 12
        file: file:///inverted-assertions.js
      source: |-
        assert.not(1, 2)
        assert.not.coercively(1, '1')
        -----------^
        assert.not.coercively(1, '2')
      stack: test/fixtures/inverted-assertions.js:13:37
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
        line: 107
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.not.coercively(1, '2')
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
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
        line: 109
        column: 14
        file: file:///inverted-assertions.js
      source: |-
        -------------^
      stack: test/fixtures/inverted-assertions.js:13:37
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
        line: 111
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
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
        line: 113
        column: 15
        file: file:///inverted-assertions.js
      source: |-
        --------------^
        assert.execution(Promise.resolve('y'))
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 22 - should not deep equal
    ok 23 - should resolve
    not ok 24 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 116
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.execution(Promise.resolve('y'))
        assert.execution(Promise.reject(Error('n')))
        -------^
        assert.execution(async () => 'y')
        assert.execution(async () => { throw Error('n') })
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    ok 25 - should resolve
    not ok 26 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 118
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.execution(async () => 'y')
        assert.execution(async () => { throw Error('n') })
        -------^
        assert.execution(() => 'y')
        assert.execution(() => { throw Error('n') })
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    ok 27 - should return
    not ok 28 - should return
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///inverted-assertions.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 120
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.execution(() => 'y')
        assert.execution(() => { throw Error('n') })
        -------^
        assert.exception(Promise.resolve('y'))
        assert.exception(Promise.reject(Error('n')))
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 29 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 121
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.execution(() => { throw Error('n') })
        assert.exception(Promise.resolve('y'))
        -------^
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
        line: 123
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.exception(Promise.reject(Error('n')))
        assert.exception(async () => 'y')
        -------^
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
        line: 125
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.exception(async () => { throw Error('n') })
        assert.exception(() => 'y')
        -------^
        assert.exception(() => { throw Error('n') })
        await assert.end()
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    ok 34 - should throw
    1..34
not ok 5 - passing and failing mixed # time=1.3371337ms

1..5
# time=1.3371337ms
# failing=52

`

exports['classic assertions 1'] = `
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
      ...

    not ok 12 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///classic-assertions.js:13:37
              at index.js:13:37
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
        stack: |-
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
        stack: |-
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
      ...

    not ok 12 - but
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///classic-assertions.js:13:37
              at index.js:13:37
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
        stack: |-
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
        stack: |-
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
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
      stack: test/fixtures/classic-assertions.js:13:37
      ...

    ok 22 - should not deep equal
    ok 23 - should resolve
    not ok 24 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
          Error: n
              at file:///classic-assertions.js:13:37
              at index.js:13:37
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

    ok 25 - should resolve
    not ok 26 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
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
    not ok 28 - should return
      ---
      actual:
        !error
        name: Error
        message: n
        stack: |-
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
      stack: test/fixtures/classic-assertions.js:13:37
      ...

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

`

exports['teardown 1'] = `
TAP version 13
# teardown classic
    ok 1 - passed
    1..1
ok 1 - teardown classic # time=1.3371337ms

# TEARDOWN SUCCESSFUL (classic) 

# teardown inverted
    ok 1 - passed
    1..1
ok 2 - teardown inverted # time=1.3371337ms

# TEARDOWN SUCCESSFUL (inverted) 

# teardown after error classic
    not ok 0 - test
      ---
      actual:
        !error
        name: Error
        message: test
        stack: |-
          Error: test
              at file:///teardown.js:13:37
              at file:///teardown.js:13:37
        test: teardown after error classic
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: test::"
      ...

not ok 3 - teardown after error classic # time=1.3371337ms

# teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan
    1..1
    # teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan - subtest
        1..1
        ok 1 - passed
    ok 1 - teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan - subtest # time=1.3371337ms
ok 4 - teardown of parent assert should not hang due to an active handle when child assert completion meets parent plan # time=1.3371337ms

# TEARDOWN AFTER ERROR SUCCESSFUL (classic) 

1..4
# time=1.3371337ms
# failing=1

`

exports['timeout 1'] = `
TAP version 13
# timeout option, classic, no plan
    not ok 0 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout option, classic, no plan
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      ...

not ok 1 - timeout option, classic, no plan # time=1.3371337ms

# timeout option, inverted, no plan
    not ok 1 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout option, inverted, no plan
        plan: 0
        count: 0
        ended: false
        trace:
          code: ERR_TIMEOUT
          test: timeout option, inverted, no plan
          plan: 0
          count: 0
          ended: false
      expected: null
      operator: execution
      ...

    1..1
not ok 2 - timeout option, inverted, no plan # time=1.3371337ms

# timeout option, classic, plan
    1..1
    not ok 0 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout option, classic, plan
        plan: 1
        count: 0
        ended: false
      expected: null
      operator: execution
      ...

not ok 3 - timeout option, classic, plan # time=1.3371337ms

# timeout option, inverted, plan
    1..1
    not ok 1 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout option, inverted, plan
        plan: 1
        count: 0
        ended: false
        trace:
          code: ERR_TIMEOUT
          test: timeout option, inverted, plan
          plan: 1
          count: 0
          ended: false
      expected: null
      operator: execution
      ...

not ok 4 - timeout option, inverted, plan # time=1.3371337ms

# timeout method, classic, no plan
    not ok 0 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout method, classic, no plan
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      ...

not ok 5 - timeout method, classic, no plan # time=1.3371337ms

# timeout method, inverted, no plan
    not ok 1 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout method, inverted, no plan
        plan: 0
        count: 0
        ended: false
        trace:
          code: ERR_TIMEOUT
          test: timeout method, inverted, no plan
          plan: 0
          count: 0
          ended: false
      expected: null
      operator: execution
      ...

    1..1
not ok 6 - timeout method, inverted, no plan # time=1.3371337ms

# timeout method, classic, plan
    1..1
    not ok 0 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout method, classic, plan
        plan: 1
        count: 0
        ended: false
      expected: null
      operator: execution
      ...

not ok 7 - timeout method, classic, plan # time=1.3371337ms

# timeout method, inverted, plan
    1..1
    not ok 1 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: timeout method, inverted, plan
        plan: 1
        count: 0
        ended: false
        trace:
          code: ERR_TIMEOUT
          test: timeout method, inverted, plan
          plan: 1
          count: 0
          ended: false
      expected: null
      operator: execution
      ...

not ok 8 - timeout method, inverted, plan # time=1.3371337ms

1..8
# time=1.3371337ms
# failing=8

`

exports['nesting 1'] = `
TAP version 13
# nesting - inverted parent, classic child, no plans
    ok 1 - parent pass
    # child test
        ok 1 - child pass
        1..1
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 1 - nesting - inverted parent, classic child, no plans # time=1.3371337ms

# nesting - inverted parent, classic child, no plans, await child
    ok 1 - parent pass
    # child test
        ok 1 - child pass
        1..1
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 2 - nesting - inverted parent, classic child, no plans, await child # time=1.3371337ms

# nesting - inverted parent, inverted child, no plans (no awaiting child)
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 3 - nesting - inverted parent, inverted child, no plans (no awaiting child) # time=1.3371337ms

# nesting - inverted parent, inverted child, no plans (await child before parent assert)
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 4 - nesting - inverted parent, inverted child, no plans (await child before parent assert) # time=1.3371337ms

# nesting - inverted parent, classic child, parent plan
    1..3
    ok 1 - parent pass
    # child test
        ok 1 - child pass
        1..1
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
ok 5 - nesting - inverted parent, classic child, parent plan # time=1.3371337ms

# nesting - inverted parent, classic child, parent+child plan
    1..3
    ok 1 - parent pass
    # child test
        1..1
        ok 1 - child pass
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
ok 6 - nesting - inverted parent, classic child, parent+child plan # time=1.3371337ms

# nesting - inverted parent, inverted child, parent plan (no awaiting child)
    1..3
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 7 - nesting - inverted parent, inverted child, parent plan (no awaiting child) # time=1.3371337ms

# nesting - inverted parent, inverted child, parent+child plan (no awaiting child)
    1..3
    ok 1 - parent pass
    # child assert
        1..1
        ok 1 - child pass
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 8 - nesting - inverted parent, inverted child, parent+child plan (no awaiting child) # time=1.3371337ms

# nesting - inverted parent, inverted child, parent plan (await child before parent assert)
    1..2
    # child assert
        ok 1 - child pass
        1..1
    ok 1 - child assert # time=1.3371337ms
    # before await child
    # after await child
    ok 2 - parent pass
ok 9 - nesting - inverted parent, inverted child, parent plan (await child before parent assert) # time=1.3371337ms

# nesting - inverted parent, inverted child, parent+child plan (await child before parent assert)
    1..2
    # child assert
        1..1
        ok 1 - child pass
    ok 1 - child assert # time=1.3371337ms
    ok 2 - parent pass
ok 10 - nesting - inverted parent, inverted child, parent+child plan (await child before parent assert) # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children
    1..3
    # child one
        ok 1 - passed
        ok 2 - expected truthy value
        1..2
    ok 1 - child one # time=1.3371337ms
    # child two
        ok 1 - expected truthy value
        ok 2 - passed
        1..2
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 11 - nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children
    1..3
    # child one
        ok 1 - passed
        ok 2 - expected truthy value
        1..2
    ok 1 - child one # time=1.3371337ms
    # child two
        ok 1 - expected truthy value
        ok 2 - passed
        1..2
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 12 - nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order
    1..3
    # child one
        ok 1 - passed
        ok 2 - expected truthy value
        1..2
    ok 1 - child one # time=1.3371337ms
    # child two
        ok 1 - expected truthy value
        ok 2 - passed
        1..2
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 13 - nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children
    1..3
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 14 - nesting - inverted parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children
    1..3
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    # before await child1
    # after await child1, before await child2
    # after await child1
    ok 3 - parent pass
ok 15 - nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order
    1..3
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    # before await child2
    # after await child2, before await child1
    # after await child1
    ok 3 - parent pass
ok 16 - nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order # time=1.3371337ms

# nesting - classic parent, classic child, no plans
    ok 1 - parent pass
    # child test
        ok 1 - child pass
        1..1
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 17 - nesting - classic parent, classic child, no plans # time=1.3371337ms

# nesting - classic parent, classic child, no plans, await child
    ok 1 - parent pass
    # child test
        ok 1 - child pass
        1..1
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 18 - nesting - classic parent, classic child, no plans, await child # time=1.3371337ms

# nesting - classic parent, inverted child, no plans (no awaiting child)
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 19 - nesting - classic parent, inverted child, no plans (no awaiting child) # time=1.3371337ms

# nesting - classic parent, inverted child, no plans (await child before parent assert)
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 20 - nesting - classic parent, inverted child, no plans (await child before parent assert) # time=1.3371337ms

# nesting - classic parent, classic child, parent plan
    1..3
    ok 1 - parent pass
    # child test
        ok 1 - child pass
        1..1
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
ok 21 - nesting - classic parent, classic child, parent plan # time=1.3371337ms

# nesting - classic parent, classic child, parent+child plan
    1..3
    ok 1 - parent pass
    # child test
        1..1
        ok 1 - child pass
    ok 2 - child test # time=1.3371337ms
    ok 3 - parent pass
ok 22 - nesting - classic parent, classic child, parent+child plan # time=1.3371337ms

# nesting - classic parent, inverted child, parent plan (no awaiting child)
    1..3
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 23 - nesting - classic parent, inverted child, parent plan (no awaiting child) # time=1.3371337ms

# nesting - classic parent, inverted child, parent+child plan (no awaiting child)
    1..3
    ok 1 - parent pass
    # child assert
        1..1
        ok 1 - child pass
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 24 - nesting - classic parent, inverted child, parent+child plan (no awaiting child) # time=1.3371337ms

# nesting - classic parent, inverted child, parent plan (await child before parent assert)
    1..2
    # child assert
        ok 1 - child pass
        1..1
    ok 1 - child assert # time=1.3371337ms
    # before await child
    # after await child
    ok 2 - parent pass
ok 25 - nesting - classic parent, inverted child, parent plan (await child before parent assert) # time=1.3371337ms

# nesting - classic parent, inverted child, parent+child plan (await child before parent assert)
    1..2
    # child assert
        1..1
        ok 1 - child pass
    ok 1 - child assert # time=1.3371337ms
    ok 2 - parent pass
ok 26 - nesting - classic parent, inverted child, parent+child plan (await child before parent assert) # time=1.3371337ms

# nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children
    1..3
    # child one
        ok 1 - passed
        ok 2 - expected truthy value
        1..2
    ok 1 - child one # time=1.3371337ms
    # child two
        ok 1 - expected truthy value
        ok 2 - passed
        1..2
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 27 - nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children # time=1.3371337ms

# nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children
    1..3
    # child one
        ok 1 - passed
        ok 2 - expected truthy value
        1..2
    ok 1 - child one # time=1.3371337ms
    # child two
        ok 1 - expected truthy value
        ok 2 - passed
        1..2
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 28 - nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children # time=1.3371337ms

# nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order
    1..3
    # child one
        ok 1 - passed
        ok 2 - expected truthy value
        1..2
    ok 1 - child one # time=1.3371337ms
    # child two
        ok 1 - expected truthy value
        ok 2 - passed
        1..2
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 29 - nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order # time=1.3371337ms

# nesting - classic parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children
    1..3
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    ok 3 - parent pass
ok 30 - nesting - classic parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children # time=1.3371337ms

# nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children
    1..3
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    # before await child1
    # after await child1, before await child2
    # after await child1
    ok 3 - parent pass
ok 31 - nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children # time=1.3371337ms

# nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order
    1..3
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    # before await child2
    # after await child2, before await child1
    # after await child1
    ok 3 - parent pass
ok 32 - nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order # time=1.3371337ms

1..32
# time=1.3371337ms

`

exports['comment 1'] = `
TAP version 13
# classic comment
    ok 1 - passed
    # here is a comment
    1..1
ok 1 - classic comment # time=1.3371337ms

# classic comment after classic child
    ok 1 - passed
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
    # here is a comment
    1..2
ok 2 - classic comment after classic child # time=1.3371337ms

# classic comment after inverted child
    ok 1 - passed
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
    # here is a comment
    1..2
ok 3 - classic comment after inverted child # time=1.3371337ms

# classic comment inside classic child
    ok 1 - passed
    # child
        ok 1 - passed
        # here is a child comment
        1..1
    ok 2 - child # time=1.3371337ms
    1..2
ok 4 - classic comment inside classic child # time=1.3371337ms

# classic comment on inverted child
    ok 1 - passed
    # child
        ok 1 - passed
        # here is a child comment
        1..1
    ok 2 - child # time=1.3371337ms
    1..2
ok 5 - classic comment on inverted child # time=1.3371337ms

# inverted comment
    ok 1 - passed
    # here is a comment
    1..1
ok 6 - inverted comment # time=1.3371337ms

# inverted comment after classic child
    ok 1 - passed
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
    # here is a comment
    1..2
ok 7 - inverted comment after classic child # time=1.3371337ms

# inverted comment after inverted child
    ok 1 - passed
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
    # here is a comment
    1..2
ok 8 - inverted comment after inverted child # time=1.3371337ms

# inverted comment inside classic child
    ok 1 - passed
    # child
        ok 1 - passed
        # here is a child comment
        1..1
    ok 2 - child # time=1.3371337ms
    1..2
ok 9 - inverted comment inside classic child # time=1.3371337ms

# inverted comment on inverted child
    ok 1 - passed
    # child
        ok 1 - passed
        # here is a child comment
        1..1
    ok 2 - child # time=1.3371337ms
    1..2
ok 10 - inverted comment on inverted child # time=1.3371337ms

1..10
# time=1.3371337ms

`

exports['skip 1'] = `
TAP version 13
# run this one
    ok 1 - passed
    1..1
ok 1 - run this one # time=1.3371337ms

ok 2 - skip this one # SKIP

# run this one
    ok 1 - passed
    1..1
ok 3 - run this one # time=1.3371337ms

ok 4 - tbd # SKIP

1..4
# time=1.3371337ms

`

exports['tappable errors 1'] = `
TAP version 13
# generic
    ok 1 - passed
    not ok 1 - check
      ---
      actual:
        !error
        name: Error
        message: check
        stack: |-
          Error: check
              at file:///tappable-errors.js:13:37
        test: generic
        plan: 0
        count: 1
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: check::"
      ...

    1..1
not ok 1 - generic # time=1.3371337ms

# thrown primitive (string)
    not ok 0 - string thrown ("not great but definitely done by some")
      ---
      actual:
        !error
        name: Error
        message: string thrown ("not great but definitely done by some")
        stack: null
        type: string
        value: not great but definitely done by some
        test: thrown primitive (string)
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: 'AssertionError [ERR_ASSERTION]: string thrown "not great but definitely done by some"::'
      ...

not ok 2 - thrown primitive (string) # time=1.3371337ms

# thrown primitive (number)
    not ok 0 - number thrown (1337)
      ---
      actual:
        !error
        name: Error
        message: number thrown (1337)
        stack: null
        type: number
        value: 1337
        test: thrown primitive (number)
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: number thrown 1337::"
      ...

not ok 3 - thrown primitive (number) # time=1.3371337ms

# thrown primitive (bigint)
    not ok 0 - bigint thrown (1337n)
      ---
      actual:
        !error
        name: Error
        message: bigint thrown (1337n)
        stack: null
        type: bigint
        value: 1337
        test: thrown primitive (bigint)
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: bigint thrown 1337n::"
      ...

not ok 4 - thrown primitive (bigint) # time=1.3371337ms

# thrown primitive (null)
    not ok 0 - object thrown (null)
      ---
      actual:
        !error
        name: Error
        message: object thrown (null)
        stack: null
        type: object
        value: null
        test: thrown primitive (null)
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: object thrown null::"
      ...

not ok 5 - thrown primitive (null) # time=1.3371337ms

# thrown primitive (undefined)
    not ok 0 - undefined thrown (undefined)
      ---
      actual:
        !error
        name: Error
        message: undefined thrown (undefined)
        stack: null
        type: undefined
        value: null
        test: thrown primitive (undefined)
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: undefined thrown undefined::"
      ...

not ok 6 - thrown primitive (undefined) # time=1.3371337ms

# thrown primitive (symbol)
    not ok 0 - symbol thrown (Symbol(sym))
      ---
      actual:
        !error
        name: Error
        message: symbol thrown (Symbol(sym))
        stack: null
        type: symbol
        value: !sym Symbol(sym)
        test: thrown primitive (symbol)
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: symbol thrown Symbolsym::"
      ...

not ok 7 - thrown primitive (symbol) # time=1.3371337ms

# premature end
    1..2
    ok 1 - passed
    not ok 1 - test ended prematurely [test count (1) did not reach plan (2)]
      ---
      actual:
        !error
        name: Error
        message: test ended prematurely [test count (1) did not reach plan (2)]
        stack: |-
          Error: test ended prematurely [test count (1) did not reach plan (2)]
        code: ERR_PREMATURE_END
        test: premature end
        plan: 2
        count: 1
        ended: false
      expected: null
      operator: execution
      ...

not ok 8 - premature end # time=1.3371337ms

# count exceeds plan
    1..1
    ok 1 - passed
    not ok 2 - test count [2] exceeds plan [1]
      ---
      actual:
        !error
        name: Error
        message: test count [2] exceeds plan [1]
        stack: |-
          Error: test count [2] exceeds plan [1]
              at file:///tappable-errors.js:13:37
        code: ERR_COUNT_EXCEEDS_PLAN
        test: count exceeds plan
        plan: 1
        count: 2
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: test count [2] exceeds plan [1]::"
      ...

    ok 2 - passed
not ok 9 - count exceeds plan # time=1.3371337ms

# premature end
    # inverted child of premature end
        1..2
        ok 1 - passed
        not ok 2 - test ended prematurely [test count (1) did not reach plan (2)]
          ---
          actual:
            !error
            name: Error
            message: test ended prematurely [test count (1) did not reach plan (2)]
            stack: |-
              Error: test ended prematurely [test count (1) did not reach plan (2)]
            code: ERR_PREMATURE_END
            test: inverted child of premature end
            plan: 2
            count: 1
            ended: false
            trace:
              code: ERR_PREMATURE_END
              test: inverted child of premature end
              plan: 2
              count: 1
              ended: false
          expected: null
          operator: execution
          ...

    not ok 1 - inverted child of premature end # time=1.3371337ms
    1..1
ok 10 - premature end # time=1.3371337ms

# count exceeds plan
    # inverted child of count exceeds plan
        1..1
        ok 1 - passed
        not ok 3 - test count [2] exceeds plan [1]
          ---
          actual:
            !error
            name: Error
            message: test count [2] exceeds plan [1]
            stack: |-
              Error: test count [2] exceeds plan [1]
                  at file:///tappable-errors.js:13:37
            code: ERR_COUNT_EXCEEDS_PLAN
            test: inverted child of count exceeds plan
            plan: 1
            count: 2
            ended: false
            trace:
              code: ERR_COUNT_EXCEEDS_PLAN
              test: inverted child of count exceeds plan
              plan: 1
              count: 2
              ended: false
          expected: null
          operator: execution
          stack: "AssertionError [ERR_ASSERTION]: test count [2] exceeds plan [1]::"
          ...

        ok 3 - passed
    not ok 1 - inverted child of count exceeds plan # time=1.3371337ms
    1..1
ok 11 - count exceeds plan # time=1.3371337ms

# inverted adult
    1..2
    ok 1 - passed
    not ok 2 - test ended prematurely [test count (1) did not reach plan (2)]. This is a top level inverted test, if it is not wrapped in a try/catch the process will exit now
      ---
      actual:
        !error
        name: Error
        message: |-
          test ended prematurely [test count (1) did not reach plan (2)].
          This is a top level inverted test, if it is not wrapped in a try/catch the process will exit now
        stack: |-
          Error: test ended prematurely [test count (1) did not reach plan (2)].
          This is a top level inverted test, if it is not wrapped in a try/catch the process will exit now
        code: ERR_PREMATURE_END
        test: inverted adult
        plan: 2
        count: 1
        ended: false
        trace:
          code: ERR_PREMATURE_END
          test: inverted adult
          plan: 2
          count: 1
          ended: false
      expected: null
      operator: execution
      ...

not ok 12 - inverted adult # time=1.3371337ms

1..12
# time=1.3371337ms
# failing=10

`

exports['todo 1'] = `
TAP version 13
# run this one
    ok 1 - passed
    1..1
ok 1 - run this one # time=1.3371337ms

ok 2 - todo this one # TODO

# run this one
    ok 1 - passed
    1..1
ok 3 - run this one # time=1.3371337ms

ok 4 - tbd # TODO

1..4
# time=1.3371337ms

`

exports['default description 1'] = `
TAP version 13
# tbd
    ok 1 - passed
    # tbd - subtest
        ok 1 - passed
        1..1
    ok 2 - tbd - subtest # time=1.3371337ms
    1..2
ok 1 - tbd # time=1.3371337ms

# classic
    ok 1 - passed
    # classic - subtest
        ok 1 - passed
        1..1
    ok 2 - classic - subtest # time=1.3371337ms
    1..2
ok 2 - classic # time=1.3371337ms

1..2
# time=1.3371337ms

`

exports['sync functions allowed 1'] = `
TAP version 13
# sync function allowed
    ok 1 - passed
    1..1
ok 1 - sync function allowed # time=1.3371337ms

1..1
# time=1.3371337ms

`

exports['sync functions allowed 2'] = `

`

exports['configure output stream 1'] = `
TAP version 13
# configure: output
    ok 1 - passed
    1..1
ok 1 - configure: output # time=1.3371337ms

1..1
# time=1.3371337ms

`

exports['configure output fd 1'] = `
TAP version 13
# configure: output
    ok 1 - passed
    1..1
ok 1 - configure: output # time=1.3371337ms

1..1
# time=1.3371337ms

`

exports['classic configure first 1'] = `
TAP version 13

`

exports['classic configure first 2'] = `
Brittle: Fatal Error
TestError: configuration must happen prior to registering any tests
    at file:///classic-configure-first.js:13:37
  code: 'ERR_CONFIGURE_FIRST',
  test: '',
  plan: 0,
  count: 1,
  ended: false
}

`

exports['classic plan must be integer 1'] = `
TAP version 13

`

exports['classic plan must be integer 2'] = `
Brittle: Fatal Error
TestTypeError: plan takes a positive whole number only
    at file:///classic-plan-must-be-integer.js:13:37
    at index.js:13:37
    at index.js:13:37
    at new Promise (<anonymous>)
    at file:///classic-plan-must-be-integer.js:13:37 {
  code: 'ERR_PLAN_POSITIVE'
}

`

exports['classic plan must be positive 1'] = `
TAP version 13

`

exports['classic plan must be positive 2'] = `
Brittle: Fatal Error
TestTypeError: plan takes a positive whole number only
    at file:///classic-plan-must-be-positive.js:13:37
    at index.js:13:37
    at index.js:13:37
    at new Promise (<anonymous>)
    at file:///classic-plan-must-be-positive.js:13:37 {
  code: 'ERR_PLAN_POSITIVE'
}

`

exports['classic after end assert 1'] = `
TAP version 13
# assert after end
    ok 1 - passed
    1..1
ok 1 - assert after end # time=1.3371337ms


`

exports['classic after end assert 2'] = `
Brittle: Fatal Error
TestError: assert after end in "assert after end"
    at file:///classic-after-end-assert.js:13:37 {
  code: 'ERR_ASSERT_AFTER_END',
  test: 'assert after end',
  plan: 0,
  count: 1,
  ended: true
}

`

exports['classic after end count exceeds plan 1'] = `
TAP version 13
# count exceeds plan after end
    1..1
    ok 1 - passed
ok 1 - count exceeds plan after end # time=1.3371337ms


`

exports['classic after end count exceeds plan 2'] = `
Brittle: Fatal Error
TestError: assert after end in "count exceeds plan after end" & [test count [2] exceeds plan [1]]
    at file:///classic-after-end-count-exceeds-plan.js:13:37 {
  code: 'ERR_COUNT_EXCEEDS_PLAN_AFTER_END',
  test: 'count exceeds plan after end',
  plan: 1,
  count: 1,
  ended: true
}

`

exports['classic after end teardown 1'] = `
TAP version 13
# teardown after end
    ok 1 - passed
    1..1
ok 1 - teardown after end # time=1.3371337ms


`

exports['classic after end teardown 2'] = `
Brittle: Fatal Error
TestError: teardown must be called before test ends
    at file:///classic-after-end-teardown.js:13:37 {
  code: 'ERR_TEARDOWN_AFTER_END',
  test: 'teardown after end',
  plan: 0,
  count: 1,
  ended: true
}

`

exports['inverted configure first 1'] = `
TAP version 13
# a test
    ok 1 - passed
    1..1
ok 1 - a test # time=1.3371337ms


`

exports['inverted configure first 2'] = `
Brittle: Fatal Error
TestError: configuration must happen prior to registering any tests
    at file:///inverted-configure-first.js:13:37 {
  code: 'ERR_CONFIGURE_FIRST',
  test: '',
  plan: 0,
  count: 1,
  ended: false
}

`

exports['inverted plan must be integer 1'] = `
TAP version 13

`

exports['inverted plan must be integer 2'] = `
Brittle: Fatal Error
TestTypeError: plan takes a positive whole number only
    at file:///inverted-plan-must-be-integer.js:13:37
  code: 'ERR_PLAN_POSITIVE'
}

`

exports['inverted plan must be positive 1'] = `
TAP version 13

`

exports['inverted plan must be positive 2'] = `
Brittle: Fatal Error
TestTypeError: plan takes a positive whole number only
    at file:///inverted-plan-must-be-positive.js:13:37
  code: 'ERR_PLAN_POSITIVE'
}

`

exports['inverted after end assert 1'] = `
TAP version 13
# assert after end
    ok 1 - passed
    1..1
ok 1 - assert after end # time=1.3371337ms


`

exports['inverted after end assert 2'] = `
Brittle: Fatal Error
TestError: assert after end in "assert after end"
    at file:///inverted-after-end-assert.js:13:37 {
  code: 'ERR_ASSERT_AFTER_END',
  test: 'assert after end',
  plan: 0,
  count: 1,
  ended: true
}

`

exports['inverted after end count exceeds plan 1'] = `
TAP version 13
# count exceeds plan after end
    1..1
    ok 1 - passed
ok 1 - count exceeds plan after end # time=1.3371337ms


`

exports['inverted after end count exceeds plan 2'] = `
Brittle: Fatal Error
TestError: assert after end in "count exceeds plan after end" & [test count [2] exceeds plan [1]]
    at file:///inverted-after-end-count-exceeds-plan.js:13:37 {
  code: 'ERR_COUNT_EXCEEDS_PLAN_AFTER_END',
  test: 'count exceeds plan after end',
  plan: 1,
  count: 1,
  ended: true
}

`

exports['inverted after end teardown 1'] = `
TAP version 13
# teardown after end
    ok 1 - passed
    1..1
ok 1 - teardown after end # time=1.3371337ms


`

exports['inverted after end teardown 2'] = `
Brittle: Fatal Error
TestError: teardown must be called before test ends
    at file:///inverted-after-end-teardown.js:13:37 {
  code: 'ERR_TEARDOWN_AFTER_END',
  test: 'teardown after end',
  plan: 0,
  count: 1,
  ended: true
}

`

exports['snapshot 1'] = `
TAP version 13
# classic snapshot
    ok 1 - should match snapshot
    1..1
ok 1 - classic snapshot # time=1.3371337ms

# inverted snapshot
    ok 1 - should match snapshot
    1..1
ok 2 - inverted snapshot # time=1.3371337ms

# snapshot of a symbol
    ok 1 - should match snapshot
    1..1
ok 3 - snapshot of a symbol # time=1.3371337ms

# snapshot of an Error
    ok 1 - should match snapshot
    1..1
ok 4 - snapshot of an Error # time=1.3371337ms

# snapshot of undefined
    ok 1 - should match snapshot
    1..1
ok 5 - snapshot of undefined # time=1.3371337ms

# snapshot of null
    ok 1 - should match snapshot
    1..1
ok 6 - snapshot of null # time=1.3371337ms

# snapshot of number
    ok 1 - should match snapshot
    1..1
ok 7 - snapshot of number # time=1.3371337ms

# snapshot of an object
    ok 1 - should match snapshot
    1..1
ok 8 - snapshot of an object # time=1.3371337ms

# multiple snapshots
    ok 1 - should match snapshot
    ok 2 - should match snapshot
    1..2
ok 9 - multiple snapshots # time=1.3371337ms

# child snapshot
    # the child
        ok 1 - should match snapshot
        1..1
    ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms

`

exports['snapshot 2'] = `
TAP version 13
# classic snapshot
    ok 1 - should match snapshot
    1..1
ok 1 - classic snapshot # time=1.3371337ms

# inverted snapshot
    ok 1 - should match snapshot
    1..1
ok 2 - inverted snapshot # time=1.3371337ms

# snapshot of a symbol
    ok 1 - should match snapshot
    1..1
ok 3 - snapshot of a symbol # time=1.3371337ms

# snapshot of an Error
    ok 1 - should match snapshot
    1..1
ok 4 - snapshot of an Error # time=1.3371337ms

# snapshot of undefined
    ok 1 - should match snapshot
    1..1
ok 5 - snapshot of undefined # time=1.3371337ms

# snapshot of null
    ok 1 - should match snapshot
    1..1
ok 6 - snapshot of null # time=1.3371337ms

# snapshot of number
    ok 1 - should match snapshot
    1..1
ok 7 - snapshot of number # time=1.3371337ms

# snapshot of an object
    ok 1 - should match snapshot
    1..1
ok 8 - snapshot of an object # time=1.3371337ms

# multiple snapshots
    ok 1 - should match snapshot
    ok 2 - should match snapshot
    1..2
ok 9 - multiple snapshots # time=1.3371337ms

# child snapshot
    # the child
        ok 1 - should match snapshot
        1..1
    ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms

`

exports['snapshot 3'] = `
TAP version 13
# classic snapshot
    not ok 1 - should match snapshot
      ---
      actual: "321"
      expected: "123"
      operator: snapshot
      at:
        line: 6
        column: 3
        file: file:///snapshot.js
      source: |
        test('classic snapshot', async ({ snapshot }) => {
          snapshot(TEST_VALUE)
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
      ...

    1..1
not ok 1 - classic snapshot # time=1.3371337ms

# inverted snapshot
    not ok 1 - should match snapshot
      ---
      actual: "321"
      expected: "123"
      operator: snapshot
      at:
        line: 10
        column: 8
        file: file:///snapshot.js
      source: |
        const assert = test('inverted snapshot')
        assert.snapshot(TEST_VALUE)
        -------^
        await assert.end()
      stack: |-
        fixtures/snapshot.js:13:37
      ...

    1..1
not ok 2 - inverted snapshot # time=1.3371337ms

# snapshot of a symbol
    not ok 1 - should match snapshot
      ---
      actual: <Symbol(321)>
      expected: <Symbol(123)>
      operator: snapshot
      at:
        line: 15
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of a symbol', async ({ snapshot }) => {
          snapshot(Symbol(TEST_VALUE))
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
      ...

    1..1
not ok 3 - snapshot of a symbol # time=1.3371337ms

# snapshot of an Error
    not ok 1 - should match snapshot
      ---
      actual:
        name: Error
        message: "321"
      expected:
        name: Error
        message: "123"
      operator: snapshot
      at:
        line: 19
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of an Error', async ({ snapshot }) => {
          snapshot(new Error(TEST_VALUE))
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..1
not ok 4 - snapshot of an Error # time=1.3371337ms

# snapshot of undefined
    ok 1 - should match snapshot
    1..1
ok 5 - snapshot of undefined # time=1.3371337ms

# snapshot of null
    ok 1 - should match snapshot
    1..1
ok 6 - snapshot of null # time=1.3371337ms

# snapshot of number
    not ok 1 - should match snapshot
      ---
      actual: 321
      expected: 123
      operator: snapshot
      at:
        line: 31
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of number', async ({ snapshot }) => {
          snapshot(+TEST_VALUE)
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..1
not ok 7 - snapshot of number # time=1.3371337ms

# snapshot of an object
    not ok 1 - should match snapshot
      ---
      actual:
        value: "321"
        more:
          nesting: props
      expected:
        value: "123"
        more:
          nesting: props
      operator: snapshot
      at:
        line: 35
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of an object', async ({ snapshot }) => {
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..1
not ok 8 - snapshot of an object # time=1.3371337ms

# multiple snapshots
    not ok 1 - should match snapshot
      ---
      actual: "321"
      expected: "123"
      operator: snapshot
      at:
        line: 39
        column: 3
        file: file:///snapshot.js
      source: |-
        test('multiple snapshots', async ({ snapshot }) => {
          snapshot(TEST_VALUE)
        --^
          snapshot({value: TEST_VALUE})
        })
      stack: fixtures/snapshot.js:13:37
      ...

    not ok 2 - should match snapshot
      ---
      actual:
        value: "321"
      expected:
        value: "123"
      operator: snapshot
      at:
        line: 40
        column: 3
        file: file:///snapshot.js
      source: |2
          snapshot(TEST_VALUE)
          snapshot({value: TEST_VALUE})
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..2
not ok 9 - multiple snapshots # time=1.3371337ms

# child snapshot
    # the child
        not ok 1 - should match snapshot
          ---
          actual: "321"
          expected: "123"
          operator: snapshot
          at:
            line: 45
            column: 10
            file: file:///snapshot.js
          source: |-2
              const assert = test('the child')
              assert.snapshot(TEST_VALUE)
            ---------^
              await assert.end()
            })
          stack: fixtures/snapshot.js:13:37
          ...

        1..1
    not ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms
# failing=8
# Snapshot "classic snapshot" is failing. To surgically update:
# SNAP="classic snapshot" node fixtures/snapshot.js
# Snapshot "inverted snapshot" is failing. To surgically update:
# SNAP="inverted snapshot" node fixtures/snapshot.js
# Snapshot "snapshot of a symbol" is failing. To surgically update:
# SNAP="snapshot of a symbol" node fixtures/snapshot.js
# Snapshot "snapshot of an Error" is failing. To surgically update:
# SNAP="snapshot of an Error" node fixtures/snapshot.js
# Snapshot "snapshot of number" is failing. To surgically update:
# SNAP="snapshot of number" node fixtures/snapshot.js
# Snapshot "snapshot of an object" is failing. To surgically update:
# SNAP="snapshot of an object" node fixtures/snapshot.js
# Snapshot "multiple snapshots" is failing. To surgically update:
# SNAP="multiple snapshots" node fixtures/snapshot.js
# Snapshot "multiple snapshots" is failing. To surgically update:
# SNAP="multiple snapshots" node fixtures/snapshot.js
# Snapshot "child snapshot > the child" is failing. To surgically update:
# SNAP="child snapshot > the child" node fixtures/snapshot.js

`

exports['snapshot 4'] = `
TAP version 13
# classic snapshot
    ok 1 - should match snapshot
    1..1
ok 1 - classic snapshot # time=1.3371337ms

# inverted snapshot
    ok 1 - should match snapshot
    1..1
ok 2 - inverted snapshot # time=1.3371337ms

# snapshot of a symbol
    ok 1 - should match snapshot
    1..1
ok 3 - snapshot of a symbol # time=1.3371337ms

# snapshot of an Error
    ok 1 - should match snapshot
    1..1
ok 4 - snapshot of an Error # time=1.3371337ms

# snapshot of undefined
    ok 1 - should match snapshot
    1..1
ok 5 - snapshot of undefined # time=1.3371337ms

# snapshot of null
    ok 1 - should match snapshot
    1..1
ok 6 - snapshot of null # time=1.3371337ms

# snapshot of number
    ok 1 - should match snapshot
    1..1
ok 7 - snapshot of number # time=1.3371337ms

# snapshot of an object
    ok 1 - should match snapshot
    1..1
ok 8 - snapshot of an object # time=1.3371337ms

# multiple snapshots
    ok 1 - should match snapshot
    ok 2 - should match snapshot
    1..2
ok 9 - multiple snapshots # time=1.3371337ms

# child snapshot
    # the child
        ok 1 - should match snapshot
        1..1
    ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms

`

exports['snapshot 5'] = `
TAP version 13
# classic snapshot
    ok 1 - should match snapshot
    1..1
ok 1 - classic snapshot # time=1.3371337ms

# inverted snapshot
    ok 1 - should match snapshot
    1..1
ok 2 - inverted snapshot # time=1.3371337ms

# snapshot of a symbol
    ok 1 - should match snapshot
    1..1
ok 3 - snapshot of a symbol # time=1.3371337ms

# snapshot of an Error
    ok 1 - should match snapshot
    1..1
ok 4 - snapshot of an Error # time=1.3371337ms

# snapshot of undefined
    ok 1 - should match snapshot
    1..1
ok 5 - snapshot of undefined # time=1.3371337ms

# snapshot of null
    ok 1 - should match snapshot
    1..1
ok 6 - snapshot of null # time=1.3371337ms

# snapshot of number
    ok 1 - should match snapshot
    1..1
ok 7 - snapshot of number # time=1.3371337ms

# snapshot of an object
    ok 1 - should match snapshot
    1..1
ok 8 - snapshot of an object # time=1.3371337ms

# multiple snapshots
    ok 1 - should match snapshot
    ok 2 - should match snapshot
    1..2
ok 9 - multiple snapshots # time=1.3371337ms

# child snapshot
    # the child
        ok 1 - should match snapshot
        1..1
    ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms

`

exports['snapshot 6'] = `
TAP version 13
# classic snapshot
    not ok 1 - should match snapshot
      ---
      actual: "123"
      expected: "321"
      operator: snapshot
      at:
        line: 6
        column: 3
        file: file:///snapshot.js
      source: |
        test('classic snapshot', async ({ snapshot }) => {
          snapshot(TEST_VALUE)
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
      ...

    1..1
not ok 1 - classic snapshot # time=1.3371337ms

# inverted snapshot
    not ok 1 - should match snapshot
      ---
      actual: "123"
      expected: "321"
      operator: snapshot
      at:
        line: 10
        column: 8
        file: file:///snapshot.js
      source: |
        const assert = test('inverted snapshot')
        assert.snapshot(TEST_VALUE)
        -------^
        await assert.end()
      stack: |-
        fixtures/snapshot.js:13:37
      ...

    1..1
not ok 2 - inverted snapshot # time=1.3371337ms

# snapshot of a symbol
    not ok 1 - should match snapshot
      ---
      actual: <Symbol(123)>
      expected: <Symbol(321)>
      operator: snapshot
      at:
        line: 15
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of a symbol', async ({ snapshot }) => {
          snapshot(Symbol(TEST_VALUE))
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
      ...

    1..1
not ok 3 - snapshot of a symbol # time=1.3371337ms

# snapshot of an Error
    not ok 1 - should match snapshot
      ---
      actual:
        name: Error
        message: "123"
      expected:
        name: Error
        message: "321"
      operator: snapshot
      at:
        line: 19
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of an Error', async ({ snapshot }) => {
          snapshot(new Error(TEST_VALUE))
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..1
not ok 4 - snapshot of an Error # time=1.3371337ms

# snapshot of undefined
    ok 1 - should match snapshot
    1..1
ok 5 - snapshot of undefined # time=1.3371337ms

# snapshot of null
    ok 1 - should match snapshot
    1..1
ok 6 - snapshot of null # time=1.3371337ms

# snapshot of number
    not ok 1 - should match snapshot
      ---
      actual: 123
      expected: 321
      operator: snapshot
      at:
        line: 31
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of number', async ({ snapshot }) => {
          snapshot(+TEST_VALUE)
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..1
not ok 7 - snapshot of number # time=1.3371337ms

# snapshot of an object
    not ok 1 - should match snapshot
      ---
      actual:
        value: "123"
        more:
          nesting: props
      expected:
        value: "321"
        more:
          nesting: props
      operator: snapshot
      at:
        line: 35
        column: 3
        file: file:///snapshot.js
      source: |
        test('snapshot of an object', async ({ snapshot }) => {
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..1
not ok 8 - snapshot of an object # time=1.3371337ms

# multiple snapshots
    not ok 1 - should match snapshot
      ---
      actual: "123"
      expected: "321"
      operator: snapshot
      at:
        line: 39
        column: 3
        file: file:///snapshot.js
      source: |-
        test('multiple snapshots', async ({ snapshot }) => {
          snapshot(TEST_VALUE)
        --^
          snapshot({value: TEST_VALUE})
        })
      stack: fixtures/snapshot.js:13:37
      ...

    not ok 2 - should match snapshot
      ---
      actual:
        value: "123"
      expected:
        value: "321"
      operator: snapshot
      at:
        line: 40
        column: 3
        file: file:///snapshot.js
      source: |2
          snapshot(TEST_VALUE)
          snapshot({value: TEST_VALUE})
        --^
        })
      stack: fixtures/snapshot.js:13:37
      ...

    1..2
not ok 9 - multiple snapshots # time=1.3371337ms

# child snapshot
    # the child
        not ok 1 - should match snapshot
          ---
          actual: "123"
          expected: "321"
          operator: snapshot
          at:
            line: 45
            column: 10
            file: file:///snapshot.js
          source: |-2
              const assert = test('the child')
              assert.snapshot(TEST_VALUE)
            ---------^
              await assert.end()
            })
          stack: fixtures/snapshot.js:13:37
          ...

        1..1
    not ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms
# failing=8
# Snapshot "classic snapshot" is failing. To surgically update:
# SNAP="classic snapshot" node fixtures/snapshot.js
# Snapshot "inverted snapshot" is failing. To surgically update:
# SNAP="inverted snapshot" node fixtures/snapshot.js
# Snapshot "snapshot of a symbol" is failing. To surgically update:
# SNAP="snapshot of a symbol" node fixtures/snapshot.js
# Snapshot "snapshot of an Error" is failing. To surgically update:
# SNAP="snapshot of an Error" node fixtures/snapshot.js
# Snapshot "snapshot of number" is failing. To surgically update:
# SNAP="snapshot of number" node fixtures/snapshot.js
# Snapshot "snapshot of an object" is failing. To surgically update:
# SNAP="snapshot of an object" node fixtures/snapshot.js
# Snapshot "multiple snapshots" is failing. To surgically update:
# SNAP="multiple snapshots" node fixtures/snapshot.js
# Snapshot "multiple snapshots" is failing. To surgically update:
# SNAP="multiple snapshots" node fixtures/snapshot.js
# Snapshot "child snapshot > the child" is failing. To surgically update:
# SNAP="child snapshot > the child" node fixtures/snapshot.js

`

exports['extraneous error propagation 1'] = `

`

exports['self bail 1'] = `
TAP version 13
# success
    ok 1 - passed
    1..1
ok 1 - success # time=1.3371337ms

# fail
    not ok 1 - failed
      ---
      operator: fail
      at:
        line: 7
        column: 34
        file: file:///self-bail.js
      source: |-
        test('fail', async ({ fail }) => fail())
        ---------------------------------^
        test('success again', async ({ pass }) => pass())
      stack: test/fixtures/self-bail.js:13:37
      ...

    Bail out! Failed test - fail

`

exports['extraneous error propagation 2'] = `

`

exports['multitick execution/exception 1'] = `
TAP version 13
# multi-tick execution (promise resolve)
    ok 1 - first
    ok 2 - should resolve
    ok 3 - second
    1..3
ok 1 - multi-tick execution (promise resolve) # time=1.3371337ms

# multi-tick execution (promise reject)
    ok 1 - first
    not ok 2 - should resolve
      ---
      actual:
        !error
        name: Error
        message: test
        stack: |-
          Error: test
      expected: null
      operator: execution
      at:
        line: 12
        column: 3
        file: file:///multitick-execution-exception.js
      source: |-2
          pass('first')
          execution(new Promise((_, reject) => setTimeout(()=> reject(Error('test')), 100)))
        --^
          pass('second')
        })
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    ok 3 - second
    1..3
not ok 2 - multi-tick execution (promise reject) # time=1.3371337ms

# multi-tick exception (promise resolve)
    ok 1 - first
    not ok 2 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 18
        column: 3
        file: file:///multitick-execution-exception.js
      source: |-2
          pass('first')
          exception(new Promise((resolve) => setTimeout(()=> resolve(), 100)))
        --^
          pass('second')
        })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    ok 3 - second
    1..3
not ok 3 - multi-tick exception (promise resolve) # time=1.3371337ms

# multi-tick exception (promise reject)
    ok 1 - first
    ok 2 - should reject
    ok 3 - second
    1..3
ok 4 - multi-tick exception (promise reject) # time=1.3371337ms

1..4
# time=1.3371337ms
# failing=2

`

exports['no active handles unplanned unending 1'] = `
TAP version 13
# never resolve
    not ok 0 - test ended without making or planning any assertions
      ---
      actual:
        !error
        name: Error
        message: test ended without making or planning any assertions
        stack: |-
          Error: test ended without making or planning any assertions
        code: ERR_NO_ASSERTS
        test: never resolve
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: test ended without making or planning any assertions::"
      ...

not ok 1 - never resolve # time=1.3371337ms

1..1
# time=1.3371337ms
# failing=1

`

exports['timeout failure cascade avoidance 1'] = `
TAP version 13
# tbd
    not ok 0 - test timed out after 10ms
      ---
      actual:
        !error
        name: Error
        message: test timed out after 10ms
        stack: |-
          Error: test timed out after 10ms
        code: ERR_TIMEOUT
        test: tbd
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      ...

not ok 1 - tbd # time=1.3371337ms

# tbd2
    ok 1 - passed
    1..1
ok 2 - tbd2 # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=1

`

exports['solo 1'] = `
TAP version 13
ok 1 - skip this one # SKIP

# run this one
    ok 1 - passed
    1..1
ok 2 - run this one # time=1.3371337ms

ok 3 - skip this one # SKIP

# run this one
    ok 1 - passed
    1..1
ok 4 - run this one # time=1.3371337ms

1..4
# time=1.3371337ms

`

exports['solo (manual opt-in) 1'] = `
TAP version 13
ok 1 - skip this one # SKIP

# run this one
    ok 1 - passed
    1..1
ok 2 - run this one # time=1.3371337ms

ok 3 - skip this one # SKIP

# run this one
    ok 1 - passed
    1..1
ok 4 - run this one # time=1.3371337ms

1..4
# time=1.3371337ms

`

exports['exception.all 1'] = `
TAP version 13
# exception fails when an error is native
    not ok 1 - should throw
      ---
      actual:
        !error
        name: ReferenceError
        message: test
        stack: |-
          ReferenceError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 4
        column: 3
        file: file:///exception-all.js
      source: |-
        test('exception fails when an error is native', async ({ exception }) => {
          exception(() => { throw ReferenceError('test') })
        --^
          exception(() => { throw SyntaxError('test') })
          exception(() => { throw RangeError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    not ok 2 - should throw
      ---
      actual:
        !error
        name: SyntaxError
        message: test
        stack: |-
          SyntaxError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 5
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(() => { throw ReferenceError('test') })
          exception(() => { throw SyntaxError('test') })
        --^
          exception(() => { throw RangeError('test') })
          exception(() => { throw EvalError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    not ok 3 - should throw
      ---
      actual:
        !error
        name: RangeError
        message: test
        stack: |-
          RangeError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 6
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(() => { throw SyntaxError('test') })
          exception(() => { throw RangeError('test') })
        --^
          exception(() => { throw EvalError('test') })
          exception(() => { throw TypeError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    not ok 4 - should throw
      ---
      actual:
        !error
        name: EvalError
        message: test
        stack: |-
          EvalError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 7
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(() => { throw RangeError('test') })
          exception(() => { throw EvalError('test') })
        --^
          exception(() => { throw TypeError('test') })
          exception(async () => { throw ReferenceError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    not ok 5 - should throw
      ---
      actual:
        !error
        name: TypeError
        message: test
        stack: |-
          TypeError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 8
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(() => { throw EvalError('test') })
          exception(() => { throw TypeError('test') })
        --^
          exception(async () => { throw ReferenceError('test') })
          exception(async () => { throw SyntaxError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    not ok 6 - should reject
      ---
      actual:
        !error
        name: ReferenceError
        message: test
        stack: |-
          ReferenceError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 9
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(() => { throw TypeError('test') })
          exception(async () => { throw ReferenceError('test') })
        --^
          exception(async () => { throw SyntaxError('test') })
          exception(async () => { throw RangeError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 7 - should reject
      ---
      actual:
        !error
        name: SyntaxError
        message: test
        stack: |-
          SyntaxError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 10
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(async () => { throw ReferenceError('test') })
          exception(async () => { throw SyntaxError('test') })
        --^
          exception(async () => { throw RangeError('test') })
          exception(async () => { throw EvalError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 8 - should reject
      ---
      actual:
        !error
        name: RangeError
        message: test
        stack: |-
          RangeError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 11
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(async () => { throw SyntaxError('test') })
          exception(async () => { throw RangeError('test') })
        --^
          exception(async () => { throw EvalError('test') })
          exception(async () => { throw TypeError('test') })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 9 - should reject
      ---
      actual:
        !error
        name: EvalError
        message: test
        stack: |-
          EvalError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 12
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(async () => { throw RangeError('test') })
          exception(async () => { throw EvalError('test') })
        --^
          exception(async () => { throw TypeError('test') })
          exception(Promise.reject(ReferenceError('test')))
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 10 - should reject
      ---
      actual:
        !error
        name: TypeError
        message: test
        stack: |-
          TypeError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
              at index.js:13:37
      expected: null
      operator: exception
      at:
        line: 13
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(async () => { throw EvalError('test') })
          exception(async () => { throw TypeError('test') })
        --^
          exception(Promise.reject(ReferenceError('test')))
          exception(Promise.reject(SyntaxError('test')))
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 11 - should reject
      ---
      actual:
        !error
        name: ReferenceError
        message: test
        stack: |-
          ReferenceError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
      expected: null
      operator: exception
      at:
        line: 14
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(async () => { throw TypeError('test') })
          exception(Promise.reject(ReferenceError('test')))
        --^
          exception(Promise.reject(SyntaxError('test')))
          exception(Promise.reject(RangeError('test')))
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 12 - should reject
      ---
      actual:
        !error
        name: SyntaxError
        message: test
        stack: |-
          SyntaxError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
      expected: null
      operator: exception
      at:
        line: 15
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(Promise.reject(ReferenceError('test')))
          exception(Promise.reject(SyntaxError('test')))
        --^
          exception(Promise.reject(RangeError('test')))
          exception(Promise.reject(EvalError('test')))
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 13 - should reject
      ---
      actual:
        !error
        name: RangeError
        message: test
        stack: |-
          RangeError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
      expected: null
      operator: exception
      at:
        line: 16
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(Promise.reject(SyntaxError('test')))
          exception(Promise.reject(RangeError('test')))
        --^
          exception(Promise.reject(EvalError('test')))
          exception(Promise.reject(TypeError('test')))
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 14 - should reject
      ---
      actual:
        !error
        name: EvalError
        message: test
        stack: |-
          EvalError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
      expected: null
      operator: exception
      at:
        line: 17
        column: 3
        file: file:///exception-all.js
      source: |-2
          exception(Promise.reject(RangeError('test')))
          exception(Promise.reject(EvalError('test')))
        --^
          exception(Promise.reject(TypeError('test')))
        })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 15 - should reject
      ---
      actual:
        !error
        name: TypeError
        message: test
        stack: |-
          TypeError: test
              at file:///exception-all.js:13:37
              at index.js:13:37
              at index.js:13:37
              at new Promise (<anonymous>)
              at file:///exception-all.js:13:37
      expected: null
      operator: exception
      at:
        line: 18
        column: 3
        file: file:///exception-all.js
      source: |2
          exception(Promise.reject(EvalError('test')))
          exception(Promise.reject(TypeError('test')))
        --^
        })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    1..15
not ok 1 - exception fails when an error is native # time=1.3371337ms

# exception.all does not fails when an error is native
    ok 1 - should throw
    ok 2 - should throw
    ok 3 - should throw
    ok 4 - should throw
    ok 5 - should throw
    ok 6 - should reject
    ok 7 - should reject
    ok 8 - should reject
    ok 9 - should reject
    ok 10 - should reject
    ok 11 - should reject
    ok 12 - should reject
    ok 13 - should reject
    ok 14 - should reject
    ok 15 - should reject
    1..15
ok 2 - exception.all does not fails when an error is native # time=1.3371337ms

1..2
# time=1.3371337ms
# failing=15

`

exports['adjacency 1'] = `
TAP version 13
# trailing adjacent awaits
    # big test A
        1..2
        ok 1 - big passed
        ok 2 - big pass again
    ok 1 - big test A # time=1.3371337ms
    # little test A
        1..1
        ok 1 - little passed
    ok 2 - little test A # time=1.3371337ms
    1..2
ok 1 - trailing adjacent awaits # time=1.3371337ms

# interruptive adjacent awaits
    # big test B
        1..2
        ok 1 - big passed
        ok 2 - big pass again
    ok 1 - big test B # time=1.3371337ms
    # little test B
        1..1
        ok 1 - little passed
    ok 2 - little test B # time=1.3371337ms
    1..2
ok 2 - interruptive adjacent awaits # time=1.3371337ms

# deadlocking adjacent awaits
    # big test C
        1..2
        ok 1 - big passed
        not ok 2 - test ended prematurely [test count (1) did not reach plan (2)]
          ---
          actual:
            !error
            name: Error
            message: test ended prematurely [test count (1) did not reach plan (2)]
            stack: |-
              Error: test ended prematurely [test count (1) did not reach plan (2)]
            code: ERR_PREMATURE_END
            test: big test C
            plan: 2
            count: 1
            ended: false
            trace:
              code: ERR_PREMATURE_END
              test: big test C
              plan: 2
              count: 1
              ended: false
          expected: null
          operator: execution
          ...

    not ok 1 - big test C # time=1.3371337ms
    # little test C
        1..1
        ok 1 - little passed
    ok 2 - little test C # time=1.3371337ms
    1..2
ok 3 - deadlocking adjacent awaits # time=1.3371337ms

1..3
# time=1.3371337ms

`

exports['adjacency 2'] = `

`

exports['active handles report 1'] = `
TAP version 13
# active handles report on SIGINT
    not ok 0 - test ended without making or planning any assertions
      ---
      actual:
        !error
        name: Error
        message: test ended without making or planning any assertions
        stack: |-
          Error: test ended without making or planning any assertions
        code: ERR_NO_ASSERTS
        test: active handles report on SIGINT
        plan: 0
        count: 0
        ended: false
      expected: null
      operator: execution
      stack: "AssertionError [ERR_ASSERTION]: test ended without making or planning any assertions::"
      ...

not ok 1 - active handles report on SIGINT # time=1.3371337ms

# Active Handles Report
# There are 4 handle(s) keeping the process running
# 
# # PIPEWRAP
# node_modules/debug/src/node.js:158         - tty.isatty(process.stderr.fd);
# node_modules/debug/src/common.js:115       - debug.useColors = createDebug.useColors();
# node_modules/snap-shot-core/src/index.js:3 - const debug = require('debug')('snap-shot-core')
# 
# # PIPEWRAP
# index.js:44 - const console = new Console(process.stdout, process.stderr)
# 
# # SIGNALWRAP
# index.js:117 - process.prependListener('SIGINT', async function why () {
# 
# # Timeout
# file:///active-handles-report.js:5
# file:///active-handles-report.js:4
# index.js:652                                    - const result = await fn(assert)

`
