const CODE = 'ERR_ASSERTION'

module.exports = class AssertionError extends Error {
  constructor ({ message }) {
    super(`${CODE}: ${message}`)
    this.code = CODE

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError)
    }
  }
}
