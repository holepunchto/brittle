exports.INDENT = '    '
exports.RUNNER = Symbol.for('brittle-runner')
exports.IS_NODE = !!(typeof process === 'object' && process && process.versions && (typeof (process.versions.node || process.versions.pear || process.versions.bare) === 'string') && !process.browser)
exports.IS_BARE = typeof Bare !== 'undefined'
const env = IS_BARE ? require('bare-env') : process.env
exports.DEFAULT_TIMEOUT = Number.isInteger(+env.BRITTLE_TIMEOUT) ? +env.BRITTLE_TIMEOUT : 30000
