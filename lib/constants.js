exports.INDENT = '    '
exports.RUNNER = Symbol.for('brittle-runner')
exports.IS_NODE = !!(typeof process === 'object' && process && process.versions && (typeof (process.versions.node || process.versions.pear || process.versions.bare) === 'string') && !process.browser)
exports.IS_BARE = typeof Bare !== 'undefined'
exports.DEFAULT_TIMEOUT = 30000
