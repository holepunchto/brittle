# brittle

> tap à la mode

A TAP test runner built for modern times.

<img width=300 height=200 src=brittle.png>

## API

### Initializers

To create a test the exported `test` method can be used in a few different ways.
In addition, variations of the `test` method such as `solo` and `skip` can be used
to filter when tests are executed.

Every initializer accepts the same optional options object.

#### Options

 * `timeout` (`30000`) - milliseconds to wait before ending a stalling test
 * `output` (`process.stderr`) - stream to write TAP output to
 * `concurrent` (`false`) - when `true`. Run child tests in "parallel" (event-loop concurrent). Default concurrency limit is 5.
  * `concurrency` (`1`) - sets the upper limit of child tests that can run concurrently. Only applies to traditional style (`test('desc', fn)`), not inverted tests (`const assert = test('desc')`). May be a boolean, `concurrency: true` is same as `concurrent: true`.
 * `skip` (`false`) - skip this test, alternatively use the `skip()` function
 * `todo` (`false`) - mark this test as todo and skip it, alternatively use the `todo()` function
 * `bail` (`false`) - exit the process on first test failure

See [Configuration](#configuration) for more information.


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

For inverted tests without a plan, the `end` method must be called:

```js
import test from 'brittle'

const assert = test('some test')

setTimeout(() => {
  assert.is(true, true)
  assert.end()
}, 1000)

await assert
```

If an inverted test without a plan does not need to wait for a callback to trigger an assert (e.g. if an asynchronous operation can be awaited instead or if no asynchronous operations are needed in this test), then `end` can be called inline like so:

```js
import test from 'brittle'

const assert = test('some test')

assert.is(true, true)

await assert.end()
```


#### `assert.test(description[, opts]) => assert`
#### `assert.test(description[, opts], async (assert) => {})`

A subtest can be created by calling `test` on an `assert` object.
This will provide a new sub-assert object. Using this in inverted
style can be very useful for flow control within a test:

```js
import test from 'brittle'
test('some test', async ({ assert, ok }) => {
  const assert1 = assert.test('some sub test')
  const assert2 = assert.test('some other sub test')
  assert1.plan(1)
  assert2.plan(1)

  setTimeout(() => { assert1.is(true, true) }, Math.random() * 1000)

  setTimeout(() => { assert2.is(true, true) }, Math.random() * 1000)
  
  // won't proceed past here until both assert1 and assert2 plans are fulfilled
  await assert1
  await assert2

  ok('cool')
})
```

Note how the `assert` object also has an `assert` property which is a circular reference to itself.
This is used to above so that the `assert` object and the `ok` assertion are destructured from 
the test function argument.


#### `solo(description, async function)`

Filter out other tests by using the `solo` method:

```js
import { test, solo } from 'brittle'
solo() // opt-in to solo mode first
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

If a `solo` function is called, `test` functions will not execute,
only `solo` functions.

Note how there can be more than one `solo` tests.

If `solo` is not used for the first test, calling it without
arguments (`solo()`) will trigger solo mode.

Alternatively solo mode can be enabled by setting the `SOLO`
environment variable to `1` or using the `--solo` flag with the
`brittle` test runner.

The `solo` method is also available on the `test` method,
and can be used without a function like `test`:

```js
import test from 'brittle' 
const { is } = test.solo('another test')
is(true, false)
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

### Configuration

The `configure` function can be used to set options for all tests at a given level, but must
be executed before any tests.

```js
import test, { configure } from 'brittle'

configure({ serial: true }) // run all top level tests in serial

test('some test', async (assert) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  assert.is(true, true)
})

test('another test', async (assert) => {
  assert.is(true, true)
})
```

Configuration settings do not propagate to child tests. Child test options
can be set by passing an object to the `test` function:

```js
import test from 'brittle'

// run just nested tests serially 
test('parent test', {serial: true}, async (assert) => {
  test('some test', async (assert) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    assert.is(true, true)
  })

  test('another test', async (assert) => {
    assert.is(true, true)
  })
})
```

The `assert` object also has a `configure` function which can be used to change options dynamically,
as with the top level `configure` function:

```js
import test from 'brittle'

test('parent test',  async (assert) => {
  assert.configure({serial: true}) // run just nested tests serially 
  test('some test', async (assert) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    assert.is(true, true)
  })

  test('another test', async (assert) => {
    assert.is(true, true)
  })
})
```

#### Options

 * `timeout` (30000) - milliseconds to wait before ending a stalling test
 * `output` (process.stderr) - stream to write TAP output to
 * `skip` - skip this test, alternatively use the `skip()` function
 * `todo` - mark this test as todo and skip it, alternatively use the `todo()` function
 * `bail` - exit the process on first test failure
 * `concurrency` - sets the upper limit of tests that can run concurrently. Only applies to traditional style (`test('desc', fn)`), not inverted tests (`const assert = test('desc')`). 
 * `serial` - short hand for `concurrency: 1`. run tests in serial. Only applies to traditional style (`test('desc', fn)`), not inverted tests (`const assert = test('desc')`). 


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

#### `absent(value, [ message ])`

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

If the error is an instance of any of the following native error constructors,
then this will still result in failure since native errors often tend to be unintentational.

* `ReferenceError`
* `SyntaxError`
* `RangeError`
* `EvalError`
* `TypeError`


#### `exception.all(Promise|function|async function, [ error, message ])`

Verify that a function throws, or a promise rejects, including native errors.

```js
exception.all(() => { throw Error('an err') }, /an err/)
exception.all(async () => { throw Error('an err') }, /an err/)
exception.all(Promise.reject(new SyntaxError('native error')), /an err/)
```

The `exception.all` method is an escape-hatch so it can be used with the
normally filtered native errors.


#### `execution(Promise|function|async function, [ message ])`

Assert that a function executes instead of throwing or that a promise resolves instead of rejecting.

```js
execution(() => { })
execution(async () => { })
execution(Promise.resolve('cool'))
```

#### `snapshot(actual, [ message ])`

On the first run, this assertion automatically creates a fixture in the `__snapshots__` folder of project root.
On subsequent test runs the `actual` value is asserted against the previously captured fixture as the expected value.
If the input value matches the snapshot, the test passes. Test failure means either the code should be fixed or
the snapshot should be updated. See [Updating Snapshots](#updating-snapshots) for how to regenerate snapshots.

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

If `teardown` is called multiple times in a test, every function passed will be called after the test ends

```js
import test from 'brittle'
test('some test', async ({ ok, teardown }) => {
 teardown(doSomeCleanUp)
 const assert = test('some sub test')
 const resource = createSomeResourceThatNeedsCleaningUpLaterOn()
 teardown(async () => { await resource.cleanup() })
 assert.is(resource.methodThatReturnsABoolean(), true)
 await assert
 ok('again, cool')
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

## Runner

Tests can be executed directly with `node`:

```sh
node path/to/my/test.js
```

A `brittle` runner is supplied for enhances functionality:

```sh
npm install -g brittle
```

```sh
brittle path/to/tests/*.test.js
```

Note globbing is supported.

For usage information run `brittle -h`


```
 🥜  Brittle
    
      brittle [flags] [<files>]
    
      --help | -h           Show this help
      --watch | -w          Rerun tests when a file changes
      --reporter | -R | -r  Set test reporter: tap, spec, dot
      --bail | -b           Bail out on first assert failure
      --solo                Engage solo mode
      --snap-all            Update all snapshots
      --snap <name>         Update specific snapshot by name
      --no-cov              Turn off coverage
      --100                 Fail if coverage is not 100%  
      --90                  Fail if coverage is not 90%
      --85                  Fail if coverage is not 85%
      --ec | -e             Explore coverage: --cov-report=html
      --cov-report          Set coverage reporter:
                            text, html, text-summary...
    
 🥜   --cov-help            Show advanced coverage options


```

### Updating snapshots

If a `snapshot` assert fails it is up to the developer to either verify that the current input is incorrect and fix it,
or to establish that the input is an update and therefore correct. In the event that the input is correct the `SNAP` 
environment variable or the `brittle` CLI tool can be used to update the snapshot.

#### Directly with Node

To update all snapshots in a test file:

```sh
SNAP=1 node path/to/test.js
```

To update a specific snapshot:

```sh
SNAP="name of snapshot" node path/to/test.js
```

The string is converted into a regular expression with global matching so partial matches and multiple
matches are possible.

#### `brittle` command-line

To update all snapshots in for all test files specified:

```sh
brittle --snap-all path/to/*.test.js
```

To update a specific snapshot:

```sh
brittle --snap "name of snapshot" path/to/*.test.js
```

The string is converted into a regular expression with global matching so partial matches and multiple
matches are possible.


#### `brittle` interactive watch mode

If a snapshot assert fails in watch mode, an additional function key is provided: Press **s** to manage snapshots.

This will provide a menu where individual failing snapshots can be selected so in order be individually updated.


### Example `package.json` `test` field setup

The following would run all `.js` files in the test folder, output test results using the spec reporter and re-test a project every time a file changed while also
enforcing an 85% coverage constraint. In a CI environment the watch functionality would be turned off, and the reporter would be the tap reporter.

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "test": "brittle -R spec --85 -w test/*.js"
  },
  "devDependencies": {
    "brittle": "^1.0.0"
  }
}
```

## Test execution control flow

Classic tests will run immediately, buffering the results until any prior TAP output catches up. 

In the following example `fn1` and `fn2` (both async functions) are called around the same time
as each other, so they run concurrently (because they're async). 

```js
test('first test', fn1)
test('second test', fn2)
```

In some scenarios this concurrent execution can lead to race conditions that cause (sometimes) intermittent
test failure. Setting up and tearing down a folder, for instance, can lead to this. To make tests execute
serially, `await` them:

```js
await test('first test', fn1) // runs first
test('second test', fn2) // waits until the prior tests is complete
```

At the top level this can only be done using ESM (native `import` syntax). Regardless of whether a project
is for CJS, ESM or both, it's recommended to write tests using ESM for this reason.

Control flow of inverted is entirely dependent on where its `assert` is awaited. The following executes
one test after another:

```js
const assert1 = test('first test')
const assert2 = test('second test')
assert1.plan(1)
assert2.plan(1)
assert1.pass()
await assert1
assert2.pass()
await assert2
```

These test can be executed at about the same time by changing where the `assert1` is awaited:

```js
const assert1 = test('first test')
const assert2 = test('second test')
assert1.plan(1)
assert2.plan(1)
assert1.pass()
assert2.pass()
await assert1
await assert2
```

For full concurrency pass the asserts to `Promise.allSettled` like so:

```js
const assert1 = test('first test')
const assert2 = test('second test')
assert1.plan(1)
assert2.plan(1)
assert1.pass()
assert2.pass()
await Promise.allSettled([assert1, assert2])
```


## Supported Engines

* Node 14
* Node 16

## License

MIT
