const StackParser = require('error-stack-parser')
const yaml = require('js-yaml')
const url = requireIfNode('url')
const fs = requireIfNode('fs')
const assert = requireIfNode('assert')

const AssertionError = assert ? assert.AssertionError : Error
const parseStack = StackParser.parse.bind(StackParser)

const IGNORE = [__filename, __filename.replace(/errors\.js$/, 'index.js')]

exports.stringify = stringify
exports.explain = explain

function explain (ok, message, assert, stackStartFunction, actual, expected, top, extra) {
  if (ok) return null

  const cwd = getCWD()
  const err = new AssertionError({ stackStartFunction, message, operator: assert, actual, expected })
  stackScrub(err)
  if (top) {
    err.at = {
      line: top.getLineNumber(),
      column: top.getColumnNumber(),
      file: top.getFileName()?.replace(/\?cacheBust=\d+/g, '')
    }
    try {
      try {
        if (url) err.at.file = url.fileURLToPath(new URL(err.at.file, 'file:'))
      } catch {}

      if (err.at.file.startsWith(cwd)) {
        err.at.file = err.at.file.replace(cwd, '.')
      }

      if (fs) {
        const code = fs.readFileSync(err.at.file, { encoding: 'utf-8' })
        const split = code.split(/[\n\r]/g)
        const point = Array.from({ length: err.at.column - 1 }).map(() => '-').join('') + '^'
        const source = [...split.slice(err.at.line - 2, err.at.line), point, ...split.slice(err.at.line, err.at.line + 2)]
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

  info.stack = err.stack.split('\n').slice(1).map((line) => {
    let match = false

    line = line.slice(7).replace(cwd, () => {
      match = true
      return '.'
    })

    if (match) line = line.replace(/file:\/?\/?\/?/, '')
    return line
  }).join('\n').trim()

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
  return src.split('\n').map(s => '  ' + s).join('\n')
}

function stringify (o) {
  return indent(yaml.dump(o)).trimRight()
}

function getCWD () {
  return (typeof process === 'object' && process.cwd) ? process.cwd() : '/'
}

function requireIfNode (name) {
  return (typeof process === 'object' && process && !process.browser) ? require(name) : null
}