# brittle

> tap à la mode

A fullstack TAP test runner built for modern times.

<img width=300 height=200 src=brittle.png>

## API

### Initializers

To create a test the exported `test` method can be used in a few different ways.
In addition, variations of the `test` method such as `solo` and `skip` can be used
to filter when tests are executed.

Every initializer accepts the same optional options object.

#### Options

 * `timeout` (5000) - milliseconds to wait before ending a stalling test
 * `output` (process.stderr) - stream to write TAP output to
 * `skip` - skip this test, alternatively use the `skip()` function
 * `todo` - mark this test as todo and skip it, alternatively use the `todo()` function


#### `test(description[, opts], async (assert) => {})`


Create a test trad-style. The async function will be passed an object,
which provides the assertions and utilities interface.

```js
import test from 'brittle'
test('some test', async (assert) => {
  assert.is(true, true)
})
```

For convenience the `test` method is both the default 
export and named exported method 

```js
import { test } from 'brittle'
```

#### `test(description[, opts]) => assert`

Create an inverted test. An object is returned providing
assertions and utilities interface. This object is also a promise
and can be awaited, it will will resolve at test completion.

```js
import test from 'brittle'

const assert = test('some test')

assert.plan(1)

setTimeout(() => {
  assert.is(true, true)
}, 1000)


await assert // won't proceed past here until plan is fulfilled
```

#### `assert.test(description[, opts]) => assert`
#### `assert.test(description[, opts], async (assert) => {})`

A subtest can be created by calling `test` on an `assert` object.
This will provide a new sub-assert object. Using this in inverted
style can be very useful for flow control within a test:

```js
import test from 'brittle'
test('some test', async ({ test, ok }) => {
  const assert1 = test('some sub test')
  const assert2 = test('some other sub test')
  assert1.plan(1)
  assert2.plan(2)

  setTimeout(() => { assert1.is(true, true) }, Math.random() * 1000)

  setTimeout(() => { assert2.is(true, true) }, Math.random() * 1000)
  
  // won't proceed past here until both assert1 and assert2 plans are fulfilled
  await assert1
  await assert2

  ok('cool')
})
```

The `assert` object also has a `done` property which is a circular reference to the `assert`
object, this can instead be awaited to determine sub test completion:


```js
import test from 'brittle'
test('some test', async ({ test, ok }) => {
  const { plan, done } = test('some sub test')
  const assert2 = test('some other sub test')
  plan(1)
  assert2.plan(2)

  setTimeout(() => { assert1.is(true, true) }, Math.random() * 1000)

  setTimeout(() => { assert2.is(true, true) }, Math.random() * 1000)
  
  // won't proceed past here until both assert1 and assert2 plans are fulfilled
  await done
  await assert2

  ok('cool')
})
```

#### `solo(description, async function)`

Filter out other tests by using the `solo` method:

```js
import { test, solo } from 'brittle'
test('some test', async ({ is }) => {
  is(true, true)
})
solo('another test', async ({ is }) => {
  is(true, false)
})
solo('yet another test', async ({ is }) => {
  is(false, false)
})
```

Note how there can be more than one `solo` tests.

If a `solo` function is called, `test` functions will not execute,
only `solo` functions.

The `solo` method is also available on the `test` method,
and can be used without a function like `test`:

```js
import test from 'brittle' 
const { is } = test.solo('another test')
is(true, false)
```

The detection of a `solo` function is based on execution flow,
there may be cases where `brittle` needs to be explicitly informed
to enter solo mode. Use `solo.enable()` to explicitly enable solo mode:

```js
import { test, solo } from 'brittle'
solo.enable()
await test('some test', async ({ is }) => {
  is(true, true)
})
solo('another test', async ({ is }) => {
  is(true, false)
})
```


#### `skip(description, async function)`

Skip a test: 

```js
import { test, skip } from 'brittle'
skip('some test', async ({ is }) => {
  is(true, true)
})
test('another test', async ({ is }) => {
  is(true, false)
})
```

The first test will not be executed.

The `skip` method is also available on the `test` method:

```js
import test from 'brittle' 
test.skip('some test', async ({ is }) => {
  is(true, true)
})
```


### Assertions

#### `is(actual, expected, [ message ])`

Compare `actual` to `expected` with `===`

#### `not(actual, expected, [ message ])`

Compare `actual` to `expected` with `!==`

#### `alike(actual, expected, [ message ])`

Object comparison, comparing all primitives on the 
`actual` object to those on the `expected` object
using `===`.

#### `unlike(actual, expected, [ message ])`

Object comparison, comparing all primitives on the 
`actual` object to those on the `expected` object
using `!==`.


#### `ok(value, [ message ])`

Checks that `value` is truthy: `!!value === true`

#### `not(value, [ message ])`

Checks that `value` is falsy: `!!value === false`

#### `pass([ message ])`

Asserts success. Useful for explicitly confirming
that a function was called, or that behavior is 
as expected.

#### `fail([ message ])`

Asserts failure. Useful for explicitly checking
that a function should not be called.

#### `exception(Promise|function|async function, [ error, message ])`

Verify that a function throws, or a promise rejects.

```js
exception(() => { throw Error('an err') }, /an err/)
exception(async () => { throw Error('an err') }, /an err/)
exception(Promise.reject(Error('an err')), /an err/)
```

#### `execution(Promise|function|async function, [ message ])`

Assert that a function executes instead of throwing or that a promise resolves instead of rejecting.

```js
execution(() => { })
execution(async () => { })
execution(Promise.resolve('cool'))
```


#### `is.coercively(actual, expected, [ message ])`

Compare `actual` to `expected` with `==`

#### `not.coercively(actual, expected, [ message ])`

Compare `actual` to `expected` with `!=`

#### `alike.coercively(actual, expected, [ message ])`

Object comparison, comparing all primitives on the 
`actual` object to those on the `expected` object
using `==`.

#### `unlike.coercively(actual, expected, [ message ])`

Object comparison, comparing all primitives on the 
`actual` object to those on the `expected` object
using `!=`.

### Utilities

#### `plan(n)`

Constrain a test to an explicit amount of assertions.

#### `teardown(function|async function)`

The function passed to `teardown` is called right after a test ends

```js
import test from 'brittle'
test('some test', async ({ ok, teardown }) => {
  teardown(async () => {
    await doSomeCleanUp()
  })
  const assert = test('some sub test')
  setTimeout(() => { assert.is(true, true) }, Math.random() * 1000)
  
  await assert

  ok('cool')
})
```

#### `timeout(ms)`

Fail the test after a given timeout.  

#### `comment(message)`

Inject a TAP comment into the output.

#### `end()`

Force end a test. This mostly shouldn't be needed, as 
`end` is determined by `assert` resolution or when a
containing async function completes.

### Metadata

The object returned from an initializer (`test`, `solo`, `skip`) or passed into
an async function passed to an initializer is reffered to as the `assert` object.

This `assert` object is a promise, when it resolves it provides information about the test.

The resulting information object has the following shape:

```js
{
  start: BigInt, // time when the test started in nanoseconds
  description: String, // test description
  planned: Number, // the amount of assert planned
  count: Number, // the amount of asserts executed
  error: Error || null, // an error object or null if successful
  ended: Boolean // whether the test ended
}
```

These same properties are available on the `assert` object directly, but the values are final
after `assert` has resolved.

#### Examples:


```js
import test from 'brittle' 
const assert = test('describe')
assert.plan(1)
assert.pass()
const result = await assert
console.log(result)
```

```js
import test from 'brittle' 
test('describe', async (assert) => {
  assert.plan(1)
  assert.pass()
  const result = await assert
  console.log(result)
})
```

```js
import test from 'brittle' 
const result = await test('describe', async ({ plan, pass }) => {
  plan(1)
  pass()
})
console.log(result)
```