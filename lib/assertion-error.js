const { IS_NODE } = require('./constants')
const assert = requireIfNode('assert')

class CustomAssertionError extends Error {
  constructor ({ message }) {
    super(message)
    this.code = 'ERR_ASSERTION'
    this.name = 'AssertionError'
  }
}

function requireIfNode (name) {
  try {
    return IS_NODE ? require(name) : null
  } catch {
    return null
  }
}

const AssertionError = assert ? assert.AssertionError : CustomAssertionError
module.exports = AssertionError
