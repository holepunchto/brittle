import { test } from '../../index.js'

{
  const assert = test('nesting - inverted parent, classic child, no plans')
  assert.pass('parent pass')
  assert.test('child test', async ({ pass }) => {
    pass('child pass')
  })
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, classic child, no plans, await child')
  assert.pass('parent pass')
  await assert.test('child test', async ({ pass }) => {
    pass('child pass')
  })
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, inverted child, no plans (no awaiting child)')
  assert.pass('parent pass')
  const child = assert.test('child assert')
  child.pass('child pass')
  child.end()
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, inverted child, no plans (await child before parent assert)')
  assert.pass('parent pass')
  const child = assert.test('child assert')
  child.pass('child pass')
  setTimeout(() => { child.end() }, 10)
  await child
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, classic child, parent plan')
  assert.plan(3)
  assert.pass('parent pass')
  assert.test('child test', async ({ pass }) => {
    pass('child pass')
  })
  assert.pass('parent pass')
  await assert
}

{
  const assert = test('nesting - inverted parent, classic child, parent+child plan')
  assert.plan(3)
  assert.pass('parent pass')
  assert.test('child test', async ({ pass, plan }) => {
    plan(1)
    pass('child pass')
  })
  assert.pass('parent pass')
  await assert
}

{
  const assert = test('nesting - inverted parent, inverted child, parent plan (no awaiting child)')
  assert.plan(3)
  assert.pass('parent pass')
  const child = assert.test('child assert')
  child.pass('child pass')
  assert.pass('parent pass')
  child.end()
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, inverted child, parent+child plan (no awaiting child)')
  assert.plan(3)
  assert.pass('parent pass')
  const child = assert.test('child assert')
  child.plan(1)
  child.pass('child pass')
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, inverted child, parent plan (await child before parent assert)')
  assert.plan(2)
  const child = assert.test('child assert')
  child.pass('child pass')
  setTimeout(() => child.end(), 10)
  assert.comment('before await child')
  await child
  assert.comment('after await child')
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, inverted child, parent+child plan (await child before parent assert)')
  assert.plan(2)
  const child = assert.test('child assert')
  child.plan(1)
  setTimeout(() => child.pass('child pass'), 10)
  await child
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children')
  assert.plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children')
  assert.plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order')
  assert.plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children')
  assert.plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children')
  assert.plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  assert.comment('before await child1')
  await child1
  assert.comment('after await child1, before await child2')
  await child2
  assert.comment('after await child1')
  assert.pass('parent pass')
  assert.end()
  await assert
}

{
  const assert = test('nesting - inverted parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order')
  assert.plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  assert.comment('before await child2')
  await child2
  assert.comment('after await child2, before await child1')
  await child1
  assert.comment('after await child1')
  assert.pass('parent pass')
  assert.end()
  await assert
}

test('nesting - classic parent, classic child, no plans', async ({ test, pass }) => {
  pass('parent pass')
  test('child test', async ({ pass }) => {
    pass('child pass')
  })
  pass('parent pass')
})

test('nesting - classic parent, classic child, no plans, await child', async ({ test, pass }) => {
  pass('parent pass')
  await test('child test', async ({ pass }) => {
    pass('child pass')
  })
  pass('parent pass')
})

test('nesting - classic parent, inverted child, no plans (no awaiting child)', async ({ pass, assert }) => {
  pass('parent pass')
  const child = assert.test('child assert')
  child.pass('child pass')
  child.end()
  pass('parent pass')
})

test('nesting - classic parent, inverted child, no plans (await child before parent assert)', async ({ pass, assert }) => {
  pass('parent pass')
  const child = assert.test('child assert')
  child.pass('child pass')
  setTimeout(() => { child.end() }, 10)
  await child
  pass('parent pass')
})

test('nesting - classic parent, classic child, parent plan', async ({ test, pass, plan }) => {
  plan(3)
  pass('parent pass')
  test('child test', async ({ pass }) => {
    pass('child pass')
  })
  pass('parent pass')
})

test('nesting - classic parent, classic child, parent+child plan', async ({ test, pass, plan }) => {
  plan(3)
  pass('parent pass')
  test('child test', async ({ pass, plan }) => {
    plan(1)
    pass('child pass')
  })
  pass('parent pass')
})

test('nesting - classic parent, inverted child, parent plan (no awaiting child)', async ({ pass, assert, plan }) => {
  plan(3)
  pass('parent pass')
  const child = assert.test('child assert')
  child.pass('child pass')
  pass('parent pass')
  child.end()
})

test('nesting - classic parent, inverted child, parent+child plan (no awaiting child)', async ({ pass, assert, plan }) => {
  plan(3)
  pass('parent pass')
  const child = assert.test('child assert')
  child.plan(1)
  child.pass('child pass')
  pass('parent pass')
})

test('nesting - classic parent, inverted child, parent plan (await child before parent assert)', async ({ pass, assert, comment, plan }) => {
  plan(2)
  const child = assert.test('child assert')
  child.pass('child pass')
  setTimeout(() => child.end(), 10)
  comment('before await child')
  await child
  comment('after await child')
  pass('parent pass')
})

test('nesting - classic parent, inverted child, parent+child plan (await child before parent assert)', async ({ pass, assert, plan }) => {
  plan(2)
  const child = assert.test('child assert')
  child.plan(1)
  setTimeout(() => child.pass('child pass'), 10)
  
  await child
  pass('parent pass')
})

test('nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, no awaiting children', async ({ pass, assert, plan }) => {
  plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  pass('parent pass')
})

test('nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children', async ({ pass, assert, plan }) => {
  plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  pass('parent pass')
})

test('nesting - classic parent, two inverted children, parent plan, asynchronous child assertions, awaiting children in reverse order', async ({ pass, assert, plan }) => {
  plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  pass('parent pass')
})

test('nesting - classic parent, two inverted children, parent+children plan, asynchronous child assertions, no awaiting children', async ({ pass, assert, plan }) => {
  plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  pass('parent pass')
})

test('nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children', async ({ pass, assert, plan, comment }) => {
  plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  comment('before await child1')
  await child1
  comment('after await child1, before await child2')
  await child2
  comment('after await child1')
  pass('parent pass')
})

test('nesting - classic parent, two inverted children, parent+child plan, asynchronous child assertions, awaiting children in reverse order', async ({ pass, assert, plan, comment }) => {
  plan(3)
  const child1 = assert.test('child one')
  const child2 = assert.test('child two')
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
  comment('before await child2')
  await child2
  comment('after await child2, before await child1')
  await child1
  comment('after await child1')
  pass('parent pass')
})

