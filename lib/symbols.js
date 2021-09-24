'use strict'
const kIncre = Symbol('brittle.increment')
const kCount = Symbol('brittle.count')
const kCounted = Symbol('brittle.counted')
const kError = Symbol('brittle.error')
const kResolve = Symbol('brittle.resolve')
const kTimeout = Symbol('brittle.timeout')
const kTeardowns = Symbol('brittle.teardowns')
const kSnap = Symbol('brittle.snap')
const kInfo = Symbol('brittle.info')
const kChildren = Symbol('brittle.children')
const kEnding = Symbol('brittle.ending')
const kSkip = Symbol('brittle.skip')
const kTodo = Symbol('brittle.todo')
const kLevel = Symbol('brittle.indent')
const kReset = Symbol('brittle.reset')
const kMain = Symbol('brittle.main')

module.exports = {
  kIncre,
  kCount,
  kCounted,
  kError,
  kResolve,
  kTimeout,
  kTeardowns,
  kSnap,
  kInfo,
  kChildren,
  kEnding,
  kSkip,
  kTodo,
  kLevel,
  kReset,
  kMain
}
