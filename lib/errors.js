'use strict'
const ERR_CONFIGURE_FIRST = 'configuration must happen prior to registering any tests'
const ERR_PREMATURE_END = ({ count, planned, invertedTop }) => `test ended prematurely [test count (${count}) did not reach plan (${planned})]${
  invertedTop ? '.\nThis is a top level inverted test, if it is not wrapped in a try/catch the process will exit now' : ''}`
const ERR_TEARDOWN_AFTER_END = 'teardown must be called before test ends'
const ERR_ASSERT_AFTER_END = ({ description }) => `assert after end in "${description}"`
const ERR_COUNT_EXCEEDS_PLAN = ({ count, planned }) => `test count [${count}] exceeds plan [${planned}]`
const ERR_COUNT_EXCEEDS_PLAN_AFTER_END = ({ count, planned, description }) => `${ERR_ASSERT_AFTER_END({ description })} & [${ERR_COUNT_EXCEEDS_PLAN({ count, planned })}]`
const ERR_NO_ASSERTS = 'test ended without making or planning any assertions'
const ERR_TIMEOUT = ({ ms }) => `test timed out after ${ms}ms`
const ERR_PLAN_POSITIVE = 'plan takes a positive whole number only'
const ERR_ASYNC_ONLY = 'test functions must be async'

const errors = {
  ERR_CONFIGURE_FIRST,
  ERR_PREMATURE_END,
  ERR_TEARDOWN_AFTER_END,
  ERR_ASSERT_AFTER_END,
  ERR_COUNT_EXCEEDS_PLAN,
  ERR_COUNT_EXCEEDS_PLAN_AFTER_END,
  ERR_NO_ASSERTS,
  ERR_TIMEOUT,
  ERR_PLAN_POSITIVE,
  ERR_ASYNC_ONLY
}

class TestError extends Error {
  constructor (code, state) {
    const err = errors[code]
    const msg = `${typeof err === 'function' ? err(state) : err}`
    super(msg)
    this.code = code
  }
}

class TestTypeError extends TypeError {
  constructor (code, state) {
    super(errors[code])
    this.code = code
  }
}

class PrimitiveError extends Error {
  constructor (value) {
    const type = typeof value
    const quote = type === 'symbol' ? value.toString() : (type === 'bigint') ? value + 'n' : JSON.stringify(value)
    super(`${type} thrown (${quote})`)
    this.type = type
    this.value = value
    delete this.stack
  }
}

module.exports = {
  TestError,
  TestTypeError,
  PrimitiveError,
  ...errors
}
