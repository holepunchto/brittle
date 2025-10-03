import { spawner } from './helpers/index.js'

await spawner(
  function ({ test, hook }) {
    const resource = {}

    test('check resource', function (t) {
      t.is(resource.hooked, undefined)
    })

    hook('setup resource', function () {
      resource.hooked = true
    })

    test('check resource', function (t) {
      t.is(resource.hooked, true)
    })

    hook('teardown resource', function () {
      resource.hooked = undefined
    })

    test('check resource', function (t) {
      t.is(resource.hooked, undefined)
    })
  },
  `
TAP version 13

# check resource
  ok 1 - should be equal
ok 1 - check resource # time = 0.761623ms

# setup resource
ok 2 - setup resource # time = 0.06351ms

# check resource
    ok 1 - should be equal
ok 3 - check resource # time = 0.116902ms

# teardown resource
ok 4 - teardown resource # time = 0.06351ms

# check resource
    ok 1 - should be equal
ok 5 - check resource # time = 0.116902ms

1..5
# tests = 5/5 pass
# asserts = 3/3 pass
# time = 4.934907ms

# ok
`,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ solo, hook }) {
    const resource = {}

    solo('solo check resource', function (t) {
      t.is(resource.hooked, undefined)
    })

    hook('setup resource', function () {
      resource.hooked = true
    })

    solo('solo check resource', function (t) {
      t.is(resource.hooked, true)
    })

    hook('teardown resource', function () {
      resource.hooked = undefined
    })

    solo('solo check resource', function (t) {
      t.is(resource.hooked, undefined)
    })
  },
  `
TAP version 13

# solo check resource
  ok 1 - should be equal
ok 1 - solo check resource # time = 0.761623ms

# setup resource
ok 2 - setup resource # time = 0.06351ms

# solo check resource
    ok 1 - should be equal
ok 3 - solo check resource # time = 0.116902ms

# teardown resource
ok 4 - teardown resource # time = 0.06351ms

# solo check resource
    ok 1 - should be equal
ok 5 - solo check resource # time = 0.116902ms

1..5
# tests = 5/5 pass
# asserts = 3/3 pass
# time = 4.934907ms

# ok
`,
  { exitCode: 0, stderr: '' }
)

await spawner(
  function ({ test, solo, hook }) {
    const resource = {}

    test('test check resource', function (t) {
      t.fail()
    })

    solo('solo check resource', function (t) {
      t.is(resource.hooked, undefined)
    })

    hook('setup resource', function () {
      resource.hooked = true
    })

    test('test check resource', function (t) {
      t.fail()
    })

    solo('solo check resource', function (t) {
      t.is(resource.hooked, true)
    })

    hook('redundant hook option is ignored', { hook: false }, function () {
      resource.hooked = undefined
    })

    test('test check resource', function (t) {
      t.fail()
    })

    solo('solo check resource', function (t) {
      t.is(resource.hooked, undefined)
    })
  },
  `
TAP version 13

# solo check resource
  ok 1 - should be equal
ok 1 - solo check resource # time = 0.761623ms

# setup resource
ok 2 - setup resource # time = 0.06351ms

# solo check resource
    ok 1 - should be equal
ok 3 - solo check resource # time = 0.116902ms

# redundant hook option is ignored
ok 4 - redundant hook option is ignored # time = 0.06351ms

# solo check resource
    ok 1 - should be equal
ok 5 - solo check resource # time = 0.116902ms

1..5
# tests = 5/5 pass
# asserts = 3/3 pass
# time = 4.934907ms

# ok
`,
  { exitCode: 0, stderr: '' }
)
