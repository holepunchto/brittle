'use strict'
const kIncre = Symbol('brittle.increment')
const kCount = Symbol('brittle.count')
const kCounted = Symbol('brittle.counted')
const kError = Symbol('brittle.error')
const kResolve = Symbol('brittle.resolve')
const kReject = Symbol('brittle.reject')
const kTimeout = Symbol('brittle.timeout')
const kTeardowns = Symbol('brittle.teardowns')
const kSnap = Symbol('brittle.snap')
const kInfo = Symbol('brittle.info')
const kChildren = Symbol('brittle.children')
const kEnding = Symbol('brittle.ending')
const kSkip = Symbol('brittle.skip')
const kTodo = Symbol('brittle.todo')
const kLevel = Symbol('brittle.indent')
const kInverted = Symbol('brittle.inverted')
const kReset = Symbol('brittle.reset')
const kQueue = Symbol('brittle.queue')
const kAssertQ = Symbol('brittle.assertq')
const kMain = Symbol('brittle.main')

module.exports = {
  kIncre,
  kCount,
  kCounted,
  kError,
  kResolve,
  kReject,
  kTimeout,
  kTeardowns,
  kSnap,
  kInfo,
  kChildren,
  kEnding,
  kSkip,
  kTodo,
  kLevel,
  kInverted,
  kReset,
  kQueue,
  kAssertQ,
  kMain
}
