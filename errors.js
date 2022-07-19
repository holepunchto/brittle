const { fileURLToPath } = require('url')
const { readFileSync } = require('fs')
const { AssertionError } = require('assert')
const StackParser = require('error-stack-parser')
const yaml = require('tap-yaml')

const parseStack = StackParser.parse.bind(StackParser)

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
      let file = err.at.file
      try { file = fileURLToPath(new URL(err.at.file, 'file:')) } catch {}
      const code = readFileSync(file, { encoding: 'utf-8' })
      const split = code.split(/[\n\r]/g)
      const point = Array.from({ length: err.at.column - 1 }).map(() => '-').join('') + '^'
      const source = [...split.slice(err.at.line - 2, err.at.line), point, ...split.slice(err.at.line, err.at.line + 2)]
      err.source = source.join('\n')
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
      return ''
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
    const scrubbed = parseStack(err).filter(({ fileName }) => fileName !== __filename)
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
  return indent(yaml.stringify(o)).trimRight()
}

function getCWD () {
  return (typeof process === 'object' && process.cwd) ? process.cwd() : '/'
}
