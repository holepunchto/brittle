exports.INDENT = '    '
exports.RUNNER = Symbol.for('brittle-runner')
exports.IS_NODE = !!(typeof process === 'object' && process && process.versions && (typeof process.versions.node === 'string' || typeof process.versions.pear === 'string') && !process.browser)
exports.DEFAULT_TIMEOUT = 30000
