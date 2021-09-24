/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/index.test.js TAP classic after end assert > must match snapshot 1`] = `
TAP version 13
# assert after end
    ok 1 - passed
    1..1
ok 1 - assert after end # time=1.3371337ms


`

exports[`test/index.test.js TAP classic after end assert > must match snapshot 2`] = `
Brittle: Fatal Error
TestError: assert after end in assert after end
    at file:///classic-after-end-assert.js:13:37 {
  code: 'ERR_ASSERT_AFTER_END',
  test: 'assert after end',
  plan: 0,
  count: 1,
  ended: true
}

`

exports[`test/index.test.js TAP classic after end teardown > must match snapshot 1`] = `
TAP version 13
# teardown after end
    ok 1 - passed
    1..1
ok 1 - teardown after end # time=1.3371337ms


`

exports[`test/index.test.js TAP classic after end teardown > must match snapshot 2`] = `
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

exports[`test/index.test.js TAP classic assertions > must match snapshot 1`] = `
TAP version 13
    ok 1 - passed
    ok 2 - expected truthy value
    ok 3 - should be equal
    ok 4 - should be equal
    ok 5 - should not be equal
    ok 6 - should not be equal
    ok 7 - should deep equal
    ok 8 - should deep equal
    ok 9 - should not deep equal
    ok 10 - should not deep equal
    ok 11 - should resolve
    ok 12 - should resolve
    ok 13 - should return
    ok 14 - should reject
    ok 15 - should reject
    ok 16 - should throw
    1..16
ok 1 - passing (default messages) # time=1.3371337ms

    ok 1 - peanut
    ok 2 - brittle
    ok 3 - is an
    ok 4 - often
    ok 5 - overlooked
    ok 6 - tasty
    ok 7 - treat
    ok 8 - you should
    ok 9 - try it
    ok 10 - sometime
    ok 11 - but
    ok 12 - not really
    ok 13 - personally
    ok 14 - I have not had it
    ok 15 - in a long
    ok 16 - long time
    1..16
ok 2 - passing (custom messages) # time=1.3371337ms

    not ok 1 - failed
      ---
      operator: fail
      at:
        line: 42
        column: 10
        file: file:///classic-assertions.js
      source: |-
        test('failing (default messages)', async (assert) => {
          assert.fail()
        ---------^
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
        line: 43
        column: 10
        file: file:///classic-assertions.js
      source: |-2
          assert.fail()
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 3 - should be equal
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 44
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 4 - should be equal
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 45
        column: 13
        file: file:///classic-assertions.js
      source: |-2
        ------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 5 - should not be equal
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 46
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 6 - should not be equal
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 47
        column: 14
        file: file:///classic-assertions.js
      source: |-2
        -------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 7 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 48
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 8 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 49
        column: 16
        file: file:///classic-assertions.js
      source: |-2
        ---------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 9 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 50
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 10 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 51
        column: 17
        file: file:///classic-assertions.js
      source: |-2
        ----------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 11 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///classic-assertions.js:13:37
              at index.js:13:37
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 52
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
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
              at file:///classic-assertions.js:13:37
              at index.js:13:37
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 53
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    not ok 13 - should return
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
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 54
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 14 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 55
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 15 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 56
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
        })
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 16 - should throw
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 57
        column: 10
        file: file:///classic-assertions.js
      source: |2
        ---------^
        })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    1..16
not ok 3 - failing (default messages) # time=1.3371337ms

    not ok 1 - peanut
      ---
      operator: fail
      at:
        line: 61
        column: 10
        file: file:///classic-assertions.js
      source: |-
        test('failing (custom messages)', async (assert) => {
        ---------^
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
        line: 62
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 3 - is an
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 63
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 4 - often
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 64
        column: 13
        file: file:///classic-assertions.js
      source: |-2
        ------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 5 - overlooked
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 65
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 6 - tasty
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 66
        column: 14
        file: file:///classic-assertions.js
      source: |-2
        -------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 7 - treat
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 67
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 8 - you should
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 68
        column: 16
        file: file:///classic-assertions.js
      source: |-2
        ---------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 9 - try it
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 69
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 10 - sometime
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 70
        column: 17
        file: file:///classic-assertions.js
      source: |-2
        ----------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 11 - but
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///classic-assertions.js:13:37
              at index.js:13:37
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 71
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: but::"
      ...

    not ok 12 - not really
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
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 72
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: not really::"
      ...

    not ok 13 - personally
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
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 73
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    not ok 14 - I have not had it
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 74
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: I have not had it::"
      ...

    not ok 15 - in a long
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 75
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
        })
      stack: "AssertionError [ERR_ASSERTION]: in a long::"
      ...

    not ok 16 - long time
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 76
        column: 10
        file: file:///classic-assertions.js
      source: |2
        ---------^
        })
      stack: "AssertionError [ERR_ASSERTION]: long time::"
      ...

    1..16
not ok 4 - failing (custom messages) # time=1.3371337ms

# passing and failing mixed
    not ok 1 - failed
      ---
      operator: fail
      at:
        line: 80
        column: 10
        file: file:///classic-assertions.js
      source: |-
        test('passing and failing mixed', async (assert) => {
          assert.fail()
        ---------^
          assert.pass()
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
        line: 82
        column: 10
        file: file:///classic-assertions.js
      source: |-2
          assert.pass()
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 4 - expected truthy value
    not ok 5 - should be equal
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 84
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 6 - should be equal
    not ok 7 - should be equal
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 86
        column: 13
        file: file:///classic-assertions.js
      source: |-2
        ------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 8 - should be equal
    not ok 9 - should not be equal
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 88
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 10 - should not be equal
    not ok 11 - should not be equal
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 90
        column: 14
        file: file:///classic-assertions.js
      source: |-2
        -------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 12 - should not be equal
    not ok 13 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 92
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 14 - should deep equal
    not ok 15 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 94
        column: 16
        file: file:///classic-assertions.js
      source: |-2
        ---------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 16 - should deep equal
    not ok 17 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 96
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 18 - should not deep equal
    not ok 19 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 98
        column: 17
        file: file:///classic-assertions.js
      source: |-2
        ----------------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

    ok 20 - should not deep equal
    ok 21 - should resolve
    not ok 22 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///classic-assertions.js:13:37
              at index.js:13:37
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 101
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    not ok 26 - should return
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
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 105
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: |-
        test/fixtures/classic-assertions.js:13:37
        test/fixtures/classic-assertions.js:13:37
      ...

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
              at file:///classic-assertions.js:13:37
              at index.js:13:37
              at file:///classic-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 103
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    ok 25 - should return
    not ok 27 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 106
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    ok 28 - should reject
    not ok 29 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 108
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    ok 30 - should reject
    not ok 31 - should throw
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 110
        column: 10
        file: file:///classic-assertions.js
      source: |-2
        ---------^
        })
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    ok 32 - should throw
    1..32
not ok 5 - passing and failing mixed # time=1.3371337ms

1..5
# time=1.3371337ms

`

exports[`test/index.test.js TAP classic fail > must match snapshot 1`] = `
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
          fail()
        --^
        })
      stack: |-
        test/fixtures/classic-fail.js:13:37
        test/fixtures/classic-fail.js:13:37
      ...

not ok 2 - classic, with plan # time=1.3371337ms

1..2
# time=1.3371337ms

`

exports[`test/index.test.js TAP classic pass > must match snapshot 1`] = `
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

`

exports[`test/index.test.js TAP comment > must match snapshot 1`] = `
TAP version 13
# classic comment
    ok 1 - passed
    # here is a comment
    1..1
ok 1 - classic comment # time=1.3371337ms

# classic comment after classic child
    ok 1 - passed
    # here is a comment, it will print before child asserts
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
    1..2
ok 2 - classic comment after classic child # time=1.3371337ms

# classic comment after inverted child
    ok 1 - passed
    # here is a comment, it will print before child asserts
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
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
    # here is a comment, it will print before child asserts
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
    1..2
ok 7 - inverted comment after classic child # time=1.3371337ms

# inverted comment after inverted child
    ok 1 - passed
    # here is a comment, it will print before child asserts
    # child
        ok 1 - passed
        1..1
    ok 2 - child # time=1.3371337ms
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

exports[`test/index.test.js TAP inverted after end assert > must match snapshot 1`] = `
TAP version 13
# assert after end
    ok 1 - passed
    1..1
ok 1 - assert after end # time=1.3371337ms


`

exports[`test/index.test.js TAP inverted after end assert > must match snapshot 2`] = `
Brittle: Fatal Error
TestError: assert after end in assert after end
    at file:///inverted-after-end-assert.js:13:37 {
  code: 'ERR_ASSERT_AFTER_END',
  test: 'assert after end',
  plan: 0,
  count: 1,
  ended: true
}

`

exports[`test/index.test.js TAP inverted after end teardown > must match snapshot 1`] = `
TAP version 13
# teardown after end
    ok 1 - passed
    1..1
ok 1 - teardown after end # time=1.3371337ms


`

exports[`test/index.test.js TAP inverted after end teardown > must match snapshot 2`] = `
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

exports[`test/index.test.js TAP inverted assertions > must match snapshot 1`] = `
TAP version 13
    ok 1 - passed
    ok 2 - expected truthy value
    ok 3 - should be equal
    ok 4 - should be equal
    ok 5 - should not be equal
    ok 6 - should not be equal
    ok 7 - should deep equal
    ok 8 - should deep equal
    ok 9 - should not deep equal
    ok 10 - should not deep equal
    ok 11 - should resolve
    ok 12 - should resolve
    ok 13 - should return
    ok 14 - should reject
    ok 15 - should reject
    ok 16 - should throw
    1..16
ok 1 - passing (default messages) # time=1.3371337ms

    ok 1 - peanut
    ok 2 - brittle
    ok 3 - is an
    ok 4 - often
    ok 5 - overlooked
    ok 6 - tasty
    ok 7 - treat
    ok 8 - you should
    ok 9 - try it
    ok 10 - sometime
    ok 11 - but
    ok 12 - not really
    ok 13 - personally
    ok 14 - I have not had it
    ok 15 - in a long
    ok 16 - long time
    1..16
ok 2 - passing (custom messages) # time=1.3371337ms

    not ok 1 - failed
      ---
      operator: fail
      at:
        line: 47
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.fail()
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 2 - expected truthy value
      ---
      actual: false
      expected: true
      operator: ok
      at:
        line: 48
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.fail()
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 3 - should be equal
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 49
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 4 - should be equal
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 50
        column: 13
        file: file:///inverted-assertions.js
      source: |-2
        ------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 5 - should not be equal
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 51
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 6 - should not be equal
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 52
        column: 14
        file: file:///inverted-assertions.js
      source: |-2
        -------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 7 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 53
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 8 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 54
        column: 16
        file: file:///inverted-assertions.js
      source: |-2
        ---------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 9 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 55
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 10 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 56
        column: 17
        file: file:///inverted-assertions.js
      source: |-2
        ----------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 11 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 57
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    not ok 12 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 58
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    not ok 13 - should return
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 59
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 14 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 60
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
          assert.exception(() => 'y') 
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 15 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 61
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
          assert.exception(() => 'y') 
          await assert.end()
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    not ok 16 - should throw
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 62
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
          assert.exception(() => 'y') 
        ---------^
          await assert.end()
        }
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    1..16
not ok 3 - failing (default messages) # time=1.3371337ms

    not ok 1 - peanut
      ---
      operator: fail
      at:
        line: 68
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 2 - brittle
      ---
      actual: false
      expected: true
      operator: ok
      at:
        line: 69
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 3 - is an
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 70
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 4 - often
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 71
        column: 13
        file: file:///inverted-assertions.js
      source: |-2
        ------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 5 - overlooked
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 72
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 6 - tasty
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 73
        column: 14
        file: file:///inverted-assertions.js
      source: |-2
        -------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 7 - treat
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 74
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 8 - you should
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 75
        column: 16
        file: file:///inverted-assertions.js
      source: |-2
        ---------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 9 - try it
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 76
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 10 - sometime
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 77
        column: 17
        file: file:///inverted-assertions.js
      source: |-2
        ----------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 11 - but
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 78
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: but::"
      ...

    not ok 12 - not really
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 79
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: not really::"
      ...

    not ok 13 - personally
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 80
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    not ok 14 - I have not had it
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 81
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
      stack: "AssertionError [ERR_ASSERTION]: I have not had it::"
      ...

    not ok 15 - in a long
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 82
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
          await assert.end()
      stack: "AssertionError [ERR_ASSERTION]: in a long::"
      ...

    not ok 16 - long time
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 83
        column: 10
        file: file:///inverted-assertions.js
      source: |-2
        ---------^
          await assert.end()
        }
      stack: "AssertionError [ERR_ASSERTION]: long time::"
      ...

    1..16
not ok 4 - failing (custom messages) # time=1.3371337ms

# passing and failing mixed
    not ok 1 - failed
      ---
      operator: fail
      at:
        line: 88
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.fail()  
        -------^
        assert.pass()
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 2 - passed
    not ok 3 - expected truthy value
      ---
      actual: false
      expected: true
      operator: ok
      at:
        line: 90
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        assert.pass()
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 4 - expected truthy value
    not ok 5 - should be equal
      ---
      actual: 1
      expected: 2
      operator: is
      at:
        line: 92
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 6 - should be equal
    not ok 7 - should be equal
      ---
      actual: "2"
      expected: 1
      operator: is
      at:
        line: 94
        column: 11
        file: file:///inverted-assertions.js
      source: |-
        ----------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 8 - should be equal
    not ok 9 - should not be equal
      ---
      actual: 1
      expected: 1
      operator: not
      at:
        line: 96
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 10 - should not be equal
    not ok 11 - should not be equal
      ---
      actual: 1
      expected: "1"
      operator: not
      at:
        line: 98
        column: 12
        file: file:///inverted-assertions.js
      source: |-
        -----------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 12 - should not be equal
    not ok 13 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: 2
      operator: alike
      at:
        line: 100
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 14 - should deep equal
    not ok 15 - should deep equal
      ---
      actual:
        a: 1
      expected:
        a: "2"
      operator: alike
      at:
        line: 102
        column: 14
        file: file:///inverted-assertions.js
      source: |-
        -------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 16 - should deep equal
    not ok 17 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: 2
      operator: unlike
      at:
        line: 104
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 18 - should not deep equal
    not ok 19 - should not deep equal
      ---
      actual:
        a: 2
      expected:
        a: "2"
      operator: unlike
      at:
        line: 106
        column: 15
        file: file:///inverted-assertions.js
      source: |-
        --------------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 20 - should not deep equal
    ok 21 - should resolve
    not ok 22 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 109
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    not ok 26 - should return
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 113
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: test/fixtures/inverted-assertions.js:13:37
      ...

    ok 23 - should resolve
    not ok 24 - should resolve
      ---
      actual:
        !error
        name: Error
        message: n
        stack: >-
          Error: n
              at file:///inverted-assertions.js:13:37
              at file:///inverted-assertions.js:13:37
      expected: null
      operator: execution
      at:
        line: 111
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: "AssertionError [ERR_ASSERTION]: should resolve::"
      ...

    ok 25 - should return
    not ok 27 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 114
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    ok 28 - should reject
    not ok 29 - should reject
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 116
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
      stack: "AssertionError [ERR_ASSERTION]: should reject::"
      ...

    ok 30 - should reject
    not ok 31 - should throw
      ---
      actual: false
      expected: null
      operator: exception
      at:
        line: 118
        column: 8
        file: file:///inverted-assertions.js
      source: |-
        -------^
        await assert.end()
      stack: "AssertionError [ERR_ASSERTION]: should throw::"
      ...

    ok 32 - should throw
    1..32
not ok 5 - passing and failing mixed # time=1.3371337ms

1..5
# time=1.3371337ms

`

exports[`test/index.test.js TAP inverted fail > must match snapshot 1`] = `
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

`

exports[`test/index.test.js TAP inverted pass > must match snapshot 1`] = `
TAP version 13
# inverted
    ok 1 - passed
    1..1
ok 1 - inverted # time=1.3371337ms

1..1
# time=1.3371337ms

`

exports[`test/index.test.js TAP nesting > must match snapshot 1`] = `
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

    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 3 - nesting - inverted parent, inverted child, no plans (no awaiting child) # time=1.3371337ms

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

    1..3
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 7 - nesting - inverted parent, inverted child, parent plan (no awaiting child) # time=1.3371337ms

    1..3
    ok 1 - parent pass
    # child assert
        1..1
        ok 1 - child pass
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 8 - nesting - inverted parent, inverted child, parent+child plan (no awaiting child) # time=1.3371337ms

    1..2
    # before await child
    # child assert
        ok 1 - child pass
        1..1
    ok 1 - child assert # time=1.3371337ms
    # after await child
    ok 2 - parent pass
ok 9 - nesting - inverted parent, inverted child, parent plan (await child before parent assert) # time=1.3371337ms

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
    # before await child1
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # after await child1, before await child2
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    # after await child1
    ok 3 - parent pass
ok 15 - nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children # time=1.3371337ms

# nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order
    1..3
    # before await child2
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

    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
    1..3
ok 19 - nesting - classic parent, inverted child, no plans (no awaiting child) # time=1.3371337ms

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

    1..3
    ok 1 - parent pass
    # child assert
        ok 1 - child pass
        1..1
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 23 - nesting - classic parent, inverted child, parent plan (no awaiting child) # time=1.3371337ms

    1..3
    ok 1 - parent pass
    # child assert
        1..1
        ok 1 - child pass
    ok 2 - child assert # time=1.3371337ms
    ok 3 - parent pass
ok 24 - nesting - classic parent, inverted child, parent+child plan (no awaiting child) # time=1.3371337ms

    1..2
    # before await child
    # child assert
        ok 1 - child pass
        1..1
    ok 1 - child assert # time=1.3371337ms
    # after await child
    ok 2 - parent pass
ok 25 - nesting - classic parent, inverted child, parent plan (await child before parent assert) # time=1.3371337ms

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
    # before await child1
    # child one
        1..2
        ok 1 - passed
        ok 2 - expected truthy value
    ok 1 - child one # time=1.3371337ms
    # after await child1, before await child2
    # child two
        1..2
        ok 1 - expected truthy value
        ok 2 - passed
    ok 2 - child two # time=1.3371337ms
    # after await child1
    ok 3 - parent pass
ok 31 - nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children # time=1.3371337ms

# nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order
    1..3
    # before await child2
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
    # after await child2, before await child1
    # after await child1
    ok 3 - parent pass
ok 32 - nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order # time=1.3371337ms

1..32
# time=1.3371337ms

`

exports[`test/index.test.js TAP skip > must match snapshot 1`] = `
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

1..3
# time=1.3371337ms

`

exports[`test/index.test.js TAP snapshot > must match snapshot 1`] = `
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

exports[`test/index.test.js TAP snapshot > must match snapshot 2`] = `
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

exports[`test/index.test.js TAP snapshot > must match snapshot 3`] = `
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
            ---------^
              await assert.end()
            })
          stack: |-
            fixtures/snapshot.js:13:37
            fixtures/snapshot.js:13:37
          ...

        1..1
    not ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms
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

exports[`test/index.test.js TAP snapshot > must match snapshot 4`] = `
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

exports[`test/index.test.js TAP snapshot > must match snapshot 5`] = `
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

exports[`test/index.test.js TAP snapshot > must match snapshot 6`] = `
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
        --^
        })
      stack: |-
        fixtures/snapshot.js:13:37
        fixtures/snapshot.js:13:37
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
            ---------^
              await assert.end()
            })
          stack: |-
            fixtures/snapshot.js:13:37
            fixtures/snapshot.js:13:37
          ...

        1..1
    not ok 1 - the child # time=1.3371337ms
    1..1
ok 10 - child snapshot # time=1.3371337ms

1..10
# time=1.3371337ms
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

exports[`test/index.test.js TAP tappable errors > must match snapshot 1`] = `
TAP version 13
# generic
    ok 1 - passed
    not ok 1 - check
      ---
      actual:
        !error
        name: Error
        message: check
        stack: >-
          Error: check
              at file:///tappable-errors.js:13:37
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

# premature end
    1..2
    ok 1 - passed
    not ok 1 - test ended prematurely [test count (1) did not reach plan (2)]
      ---
      actual:
        !error
        name: Error
        message: test ended prematurely [test count (1) did not reach plan (2)]
        stack: >-
          Error: test ended prematurely [test count (1) did not reach plan (2)]
              at file:///tappable-errors.js:13:37
              at file:///tappable-errors.js:13:37
        code: ERR_PREMATURE_END
        test: premature end
        plan: 2
        count: 1
        ended: false
      expected: null
      operator: execution
      ...

not ok 2 - premature end # time=1.3371337ms

# count exceeds plan
    1..1
    ok 1 - passed
    ok 2 - passed
    not ok 2 - test count [2] exceeds plan [1]
      ---
      actual:
        !error
        name: Error
        message: test count [2] exceeds plan [1]
        stack: >-
          Error: test count [2] exceeds plan [1]
              at file:///tappable-errors.js:13:37
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

not ok 3 - count exceeds plan # time=1.3371337ms

# premature end
    1..2
    ok 1 - passed
    not ok 1 - test ended prematurely [test count (1) did not reach plan (2)]
      ---
      actual:
        !error
        name: Error
        message: test ended prematurely [test count (1) did not reach plan (2)]
        stack: >-
          Error: test ended prematurely [test count (1) did not reach plan (2)]
              at file:///tappable-errors.js:13:37
        code: ERR_PREMATURE_END
        test: premature end
        plan: 2
        count: 1
        ended: false
      expected: null
      operator: execution
      ...

not ok 4 - premature end # time=1.3371337ms

# count exceeds plan
    1..1
    ok 1 - passed
    ok 2 - passed
    not ok 2 - test count [2] exceeds plan [1]
      ---
      actual:
        !error
        name: Error
        message: test count [2] exceeds plan [1]
        stack: >-
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

not ok 5 - count exceeds plan # time=1.3371337ms

1..5
# time=1.3371337ms

`

exports[`test/index.test.js TAP teardown > must match snapshot 1`] = `
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
        stack: >-
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

# TEARDOWN AFTER ERROR SUCCESSFUL (classic) 

1..3
# time=1.3371337ms

`

exports[`test/index.test.js TAP timeout > must match snapshot 1`] = `
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
    not ok 0 - test timed out after 10ms
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
      expected: null
      operator: execution
      ...

not ok 2 - timeout option, inverted, no plan # time=1.3371337ms

# timeout option, classic, plan
    1..1
    not ok 0 - test ended prematurely [test count (0) did not reach plan (1)]
      ---
      actual:
        !error
        name: Error
        message: test ended prematurely [test count (0) did not reach plan (1)]
        stack: |-
          Error: test ended prematurely [test count (0) did not reach plan (1)]
        code: ERR_PREMATURE_END
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
    not ok 0 - test timed out after 10ms
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
    not ok 0 - test timed out after 10ms
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
      expected: null
      operator: execution
      ...

not ok 6 - timeout method, inverted, no plan # time=1.3371337ms

# timeout method, classic, plan
    1..1
    not ok 0 - test ended prematurely [test count (0) did not reach plan (1)]
      ---
      actual:
        !error
        name: Error
        message: test ended prematurely [test count (0) did not reach plan (1)]
        stack: |-
          Error: test ended prematurely [test count (0) did not reach plan (1)]
        code: ERR_PREMATURE_END
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
    not ok 0 - test timed out after 10ms
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
      expected: null
      operator: execution
      ...

not ok 8 - timeout method, inverted, plan # time=1.3371337ms

1..8
# time=1.3371337ms

`

exports[`test/index.test.js TAP todo > must match snapshot 1`] = `
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

1..3
# time=1.3371337ms

`
