const StackParser = require('error-stack-parser')
const { INDENT, IS_NODE } = require('./constants')
const url = requireIfNode('url')
const fs = requireIfNode('fs')
const assert = requireIfNode('assert')

const AssertionError = assert ? assert.AssertionError : Error
const parseStack = StackParser.parse.bind(StackParser)

const IGNORE = typeof __filename === 'string' ? [__filename, __filename.replace(/lib(\/|\\)errors\.js$/, 'index.js')] : []

exports.stringify = stringify
exports.explain = explain

function explain (ok, message, assert, stackStartFunction, actual, expected, top, extra) {
  if (ok) return null

  const cwd = getCWD()
  const err = new AssertionError({ stackStartFunction, message, operator: assert, actual, expected })
  stackScrub(err)
  if (top) {
    const line = top.getLineNumber()
    const column = top.getColumnNumber()
    let file = top.getFileName()?.replace(/\?cacheBust=\d+/g, '')

    try {
      try {
        if (url) file = url.fileURLToPath(new URL(file, 'file:'))
      } catch {}

      if (file.startsWith(cwd)) {
        file = file.replace(cwd, '.')
      }

      if (fs) {
        const code = fs.readFileSync(file, { encoding: 'utf-8' })
        const split = code.split(/[\n\r]/g)
        const point = Array.from({ length: column - 1 }).map(() => '-').join('') + '^'
        const source = [...split.slice(line - 2, line), point, ...split.slice(line, line + 2)]
        err.source = source.join('\n')
      } else {
        err.source = ''
      }
    } /* c8 ignore next */ catch {}
  }
  const { code, generatedMessage, ...info } = err
  err.code = code
  err.generatedMessage = generatedMessage
  Object.defineProperty(info, 'err', { value: err })

  if (err.stack) {
    info.stack = err.stack.split('\n').slice(1).map((line) => {
      let match = false

      line = line.slice(7).replace(cwd, () => {
        match = true
        return '.'
      })

      if (match) line = line.replace(/file:\/?\/?\/?/, '')
      return line
    }).join('\n').trim()
  }

  if (!info.stack || code === 'ERR_TIMEOUT' || code === 'ERR_PREMATURE_END' || actual?.code === 'ERR_TIMEOUT' || actual?.code === 'ERR_PREMATURE_END') delete info.stack

  if (actual === undefined && expected === undefined) {
    delete info.actual
    delete info.expected
  }
  return info
}

function stackScrub (err) {
  if (err && err.stack) {
    const scrubbed = parseStack(err).filter(({ fileName }) => !IGNORE.includes(fileName))
    if (scrubbed.length > 0) {
      err.stack = `${Error.prototype.toString.call(err)}\n    at ${scrubbed.join('\n    at ').replace(/\?cacheBust=\d+/g, '')}`
    }
  }
  return err
}

function indent (src) {
  return src.split('\n').map(s => INDENT + '  ' + s).join('\n')
}

function stringify (o) {
  return indent('---\n' + toYAML(o)).trimRight() + '\n' + INDENT + '  ...'
}

function getCWD () {
  return IS_NODE ? process.cwd() : '/no/cwd/exists'
}

function requireIfNode (name) {
  try {
    return IS_NODE ? require(name) : null
  } catch {
    return null
  }
}

// for the life of me can't find a module that does this, that also works in the browser...
function toYAML (o, maxDepth = 5, indent = '', prev = null) {
  if (maxDepth < 0) return indent + '...'

  if (typeof o === 'string') {
    if (o.indexOf('\n') === -1) return o + '\n'
    return '|\n' + o.split('\n').map(s => indent + s).join('\n').trimRight() + '\n'
  }

  if (Array.isArray(o) || o instanceof Set) {
    let s = prev ? '\n' : ''
    for (const i of o) {
      s += indent + '- ' + toYAML(i, maxDepth - 1, indent + '  ', 'array')
    }
    return s.trimRight() + '\n'
  }

  if (o && typeof o === 'object') {
    const p = prev && prev !== 'array'
    let s = p ? '\n' : ''
    for (const k of Object.keys(o)) {
      const v = o[k]
      s += indent + k + ': ' + toYAML(v, maxDepth - 1, indent + '  ', 'object')
    }
    return (p ? s.trimRight() : s.trim()) + '\n'
  }

  return '' + o + '\n'
}
