import { tester, spawner } from './helpers/index.js'

// + if I put all this in a single spawner I think the stdout is capped to a certain length or something?

await spawner(
  async function (test) {
    const t = test('nesting - inverted parent, classic child, no plans')
    t.pass('parent pass')
    t.test('child test', function (child) {
      child.pass('child pass')
    })
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, classic child, no plans
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, classic child, no plans # time = 1.089232ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.418062ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, classic child, no plans, await child'
    )
    t.pass('parent pass')
    await t.test('child test', function (child) {
      child.pass('child pass')
    })
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, classic child, no plans, await child
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, classic child, no plans, await child # time = 1.110137ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.416211ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, inverted child, no plans (no awaiting child)'
    )
    t.pass('parent pass')
    const child = t.test('child assert')
    child.pass('child pass')
    child.end()
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, inverted child, no plans (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, inverted child, no plans (no awaiting child) # time = 0.738362ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.334126ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, inverted child, no plans (no awaiting child)'
    )
    t.pass('parent pass')
    const child = t.test('child assert')
    child.pass('child pass')
    child.end()
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, inverted child, no plans (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, inverted child, no plans (no awaiting child) # time = 0.738362ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.334126ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test('nesting - inverted parent, classic child, parent plan')
    t.plan(3)
    t.pass('parent pass')
    t.test('child test', function (child) {
      child.pass('child pass')
    })
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - inverted parent, classic child, parent plan
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, classic child, parent plan # time = 1.121999ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.47286ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, classic child, parent+child plan'
    )
    t.plan(3)
    t.pass('parent pass')
    t.test('child test', function (child) {
      child.plan(1)
      child.pass('child pass')
    })
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - inverted parent, classic child, parent+child plan
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, classic child, parent+child plan # time = 1.062033ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.399417ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, inverted child, parent plan (no awaiting child)'
    )
    t.plan(3)
    t.pass('parent pass')
    const child = t.test('child assert')
    child.pass('child pass')
    t.pass('parent pass')
    child.end()
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, inverted child, parent plan (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, inverted child, parent plan (no awaiting child) # time = 0.759473ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.34304ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, inverted child, parent+child plan (no awaiting child)'
    )
    t.plan(3)
    t.pass('parent pass')
    const child = t.test('child assert')
    child.plan(1)
    child.pass('child pass')
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, inverted child, parent+child plan (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - inverted parent, inverted child, parent+child plan (no awaiting child) # time = 0.73341ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.350751ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, inverted child, parent plan (await child before parent assert)'
    )
    t.plan(2)
    const child = t.test('child assert')
    child.pass('child pass')
    setTimeout(() => child.end(), 10)
    t.comment('before await child')
    await child
    t.comment('after await child')
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, inverted child, parent plan (await child before parent assert)
      ok 1 - (child assert) - child pass
      # before await child
      # after await child
      ok 2 - parent pass
  ok 1 - nesting - inverted parent, inverted child, parent plan (await child before parent assert) # time = 11.604408ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 13.80202ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, inverted child, parent+child plan (await child before parent assert)'
    )
    t.plan(2)
    const child = t.test('child assert')
    child.plan(1)
    setTimeout(() => child.pass('child pass'), 10)
    await child
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, inverted child, parent+child plan (await child before parent assert)
      ok 1 - (child assert) - child pass
      ok 2 - parent pass
  ok 1 - nesting - inverted parent, inverted child, parent+child plan (await child before parent assert) # time = 11.430842ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 13.684988ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children'
    )
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children
      ok 1 - parent pass
      ok 2 - (child one) - passed
      ok 3 - (child two) - expected truthy value
      ok 4 - (child one) - expected truthy value
      ok 5 - (child two) - passed
  ok 1 - nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children # time = 20.156899ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 22.629339ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children'
    )
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    await child1
    await child2
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      ok 5 - parent pass
  ok 1 - nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children # time = 20.822921ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.132243ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order'
    )
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    await child2
    await child1
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      ok 5 - parent pass
  ok 1 - nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order # time = 19.967074ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 22.381924ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children'
    )
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    child1.plan(2)
    child2.plan(2)
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children
      ok 1 - parent pass
      ok 2 - (child one) - passed
      ok 3 - (child two) - expected truthy value
      ok 4 - (child one) - expected truthy value
      ok 5 - (child two) - passed
  ok 1 - nesting - inverted parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children # time = 19.918183ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 22.255397ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children'
    )
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    child1.plan(2)
    child2.plan(2)
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
    }, 20)
    t.comment('before await child1')
    await child1
    t.comment('after await child1, before await child2')
    await child2
    t.comment('after await child1')
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children
      # before await child1
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      # after await child1, before await child2
      # after await child1
      ok 5 - parent pass
  ok 1 - nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children # time = 21.347744ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.907273ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await spawner(
  async function (test) {
    const t = test(
      'nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order'
    )
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    child1.plan(2)
    child2.plan(2)
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
    }, 20)
    t.comment('before await child2')
    await child2
    t.comment('after await child2, before await child1')
    await child1
    t.comment('after await child1')
    t.pass('parent pass')
    t.end()
  },
  `
  TAP version 13

  # nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order
      # before await child2
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      # after await child2, before await child1
      # after await child1
      ok 5 - parent pass
  ok 1 - nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order # time = 21.066805ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.405166ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, classic child, no plans',
  function (t) {
    t.pass('parent pass')
    t.test('child test', function (child) {
      child.pass('child pass')
    })
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, classic child, no plans
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, classic child, no plans # time = 0.731806ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.626858ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, classic child, no plans, await child',
  async function (t) {
    t.pass('parent pass')
    await t.test('child test', function (child) {
      child.pass('child pass')
    })
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, classic child, no plans, await child
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, classic child, no plans, await child # time = 0.756617ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.636719ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, inverted child, no plans (no awaiting child)',
  function (t) {
    t.pass('parent pass')
    const child = t.test('child assert')
    child.pass('child pass')
    child.end()
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, inverted child, no plans (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, inverted child, no plans (no awaiting child) # time = 0.719493ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.634524ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, inverted child, no plans (await child before parent assert)',
  async function (t) {
    t.pass('parent pass')
    const child = t.test('child assert')
    child.pass('child pass')
    setTimeout(() => {
      child.end()
    }, 10)
    await child
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, inverted child, no plans (await child before parent assert)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, inverted child, no plans (await child before parent assert) # time = 11.191369ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 14.024226ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, classic child, parent plan',
  async function (t) {
    t.plan(3)
    t.pass('parent pass')
    t.test('child test', function (child) {
      child.pass('child pass')
    })
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, classic child, parent plan
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, classic child, parent plan # time = 0.761372ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.721146ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, classic child, parent+child plan',
  async function (t) {
    t.plan(3)
    t.pass('parent pass')
    t.test('child test', function (child) {
      child.plan(1)
      child.pass('child pass')
    })
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, classic child, parent+child plan
      ok 1 - parent pass
      ok 2 - (child test) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, classic child, parent+child plan # time = 0.823596ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.866039ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, inverted child, parent plan (no awaiting child)',
  async function (t) {
    t.plan(3)
    t.pass('parent pass')
    const child = t.test('child assert')
    child.pass('child pass')
    t.pass('parent pass')
    child.end()
  },
  `
  TAP version 13

  # nesting - classic parent, inverted child, parent plan (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, inverted child, parent plan (no awaiting child) # time = 0.731171ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.626868ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, inverted child, parent+child plan (no awaiting child)',
  async function (t) {
    t.plan(3)
    t.pass('parent pass')
    const child = t.test('child assert')
    child.plan(1)
    child.pass('child pass')
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, inverted child, parent+child plan (no awaiting child)
      ok 1 - parent pass
      ok 2 - (child assert) - child pass
      ok 3 - parent pass
  ok 1 - nesting - classic parent, inverted child, parent+child plan (no awaiting child) # time = 0.738845ms

  1..1
  # tests = 1/1 pass
  # asserts = 3/3 pass
  # time = 3.728043ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, inverted child, parent plan (await child before parent assert)',
  async function (t) {
    t.plan(2)
    const child = t.test('child assert')
    child.pass('child pass')
    setTimeout(() => child.end(), 10)
    t.comment('before await child')
    await child
    t.comment('after await child')
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, inverted child, parent plan (await child before parent assert)
      ok 1 - (child assert) - child pass
      # before await child
      # after await child
      ok 2 - parent pass
  ok 1 - nesting - classic parent, inverted child, parent plan (await child before parent assert) # time = 11.417253ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 14.254791ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, inverted child, parent+child plan (await child before parent assert)',
  async function (t) {
    t.plan(2)
    const child = t.test('child assert')
    child.plan(1)
    setTimeout(() => child.pass('child pass'), 10)

    await child
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, inverted child, parent+child plan (await child before parent assert)
      ok 1 - (child assert) - child pass
      ok 2 - parent pass
  ok 1 - nesting - classic parent, inverted child, parent+child plan (await child before parent assert) # time = 10.29768ms

  1..1
  # tests = 1/1 pass
  # asserts = 2/2 pass
  # time = 13.206909ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children',
  function (t) {
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children
      ok 1 - parent pass
      ok 2 - (child one) - passed
      ok 3 - (child two) - expected truthy value
      ok 4 - (child one) - expected truthy value
      ok 5 - (child two) - passed
  ok 1 - nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children # time = 20.894735ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.87726ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children',
  async function (t) {
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    await child1
    await child2
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      ok 5 - parent pass
  ok 1 - nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children # time = 20.7577ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.697727ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order',
  async function (t) {
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    await child2
    await child1
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      ok 5 - parent pass
  ok 1 - nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order # time = 21.997817ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 24.908246ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children',
  async function (t) {
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    child1.plan(2)
    child2.plan(2)
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
      child1.end()
      child2.end()
    }, 20)
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children
      ok 1 - parent pass
      ok 2 - (child one) - passed
      ok 3 - (child two) - expected truthy value
      ok 4 - (child one) - expected truthy value
      ok 5 - (child two) - passed
  ok 1 - nesting - classic parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children # time = 20.756846ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.65972ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children',
  async function (t) {
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    child1.plan(2)
    child2.plan(2)
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
    }, 20)
    t.comment('before await child1')
    await child1
    t.comment('after await child1, before await child2')
    await child2
    t.comment('after await child1')
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children
      # before await child1
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      # after await child1, before await child2
      # after await child1
      ok 5 - parent pass
  ok 1 - nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children # time = 21.095796ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 24.010178ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)

await tester(
  'nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order',
  async function (t) {
    t.plan(3)
    const child1 = t.test('child one')
    const child2 = t.test('child two')
    child1.plan(2)
    child2.plan(2)
    setTimeout(() => {
      child1.pass()
      child2.ok(true)
    }, 10)
    setTimeout(() => {
      child1.ok(true)
      child2.pass()
    }, 20)
    t.comment('before await child2')
    await child2
    t.comment('after await child2, before await child1')
    await child1
    t.comment('after await child1')
    t.pass('parent pass')
  },
  `
  TAP version 13

  # nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order
      # before await child2
      ok 1 - (child one) - passed
      ok 2 - (child two) - expected truthy value
      ok 3 - (child one) - expected truthy value
      ok 4 - (child two) - passed
      # after await child2, before await child1
      # after await child1
      ok 5 - parent pass
  ok 1 - nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order # time = 20.974754ms

  1..1
  # tests = 1/1 pass
  # asserts = 5/5 pass
  # time = 23.985632ms

  # ok
  `,
  { exitCode: 0, stderr: '' }
)
